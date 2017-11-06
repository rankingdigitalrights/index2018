import os
from collections import OrderedDict
from copy import deepcopy
try:
    from .helpers.command_line_parser import parse_and_check_for_categories_overview_conversion
    from .csv_structure_checkers import ScoresOverviewTypeCsvChecker, check_overview_type_csv_structure
    from .helpers.csv_json_rw import load_rows_as_list_of_lists, load_rows_as_list_of_dicts, create_json_file
    from .helpers.fields import PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES, QuickOverviewCSVMappings, \
        COMPANIES_COLUMNS, SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES, CategoriesOverviewJsonFields, \
        TELCO_TRUE, TELCO_FALSE, QuickOverviewCSVTypeFieldValues, SUMMED_INDICATORS_JSON_FIELDS_BY_NAMES, \
        CategoriesOverviewJsonIndicatorSubFields, PREDEFINED_COMPANY_NAMES_BY_THEIR_DISPLAY_NAMES
except SystemError:
    from helpers.command_line_parser import parse_and_check_for_categories_overview_conversion
    from csv_structure_checkers import ScoresOverviewTypeCsvChecker, check_overview_type_csv_structure
    from helpers.csv_json_rw import load_rows_as_list_of_lists, load_rows_as_list_of_dicts, create_json_file
    from helpers.fields import PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES, QuickOverviewCSVMappings, \
        COMPANIES_COLUMNS, SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES, CategoriesOverviewJsonFields, \
        TELCO_TRUE, TELCO_FALSE, QuickOverviewCSVTypeFieldValues, SUMMED_INDICATORS_JSON_FIELDS_BY_NAMES, \
        CategoriesOverviewJsonIndicatorSubFields, PREDEFINED_COMPANY_NAMES_BY_THEIR_DISPLAY_NAMES

CATEGORIES_OVERVIEW_SUBDIRECTORY = 'categories/'


def _create_on_non_existent_categories_overview_subdirectory(output_directory):
    if not os.path.isdir(output_directory + CATEGORIES_OVERVIEW_SUBDIRECTORY):
        os.mkdir(output_directory + CATEGORIES_OVERVIEW_SUBDIRECTORY)


class _CompanyCSVData(object):
    def __init__(self, column_name, column_index):
        self.column_name, self.column_index = column_name, column_index


def _determine_companies_csv_data(rows):
    first_row = rows[0]
    return [_CompanyCSVData(company, first_row.index(company)) for company in COMPANIES_COLUMNS]


class _IndicatorCSVData(object):
    def __init__(self, indicator_name, row_index):
        self.indicator_name, self.row_index = indicator_name, row_index


def _determine_summed_indicators_csv_data(rows):
    result, selected_indicators_count = [], 0
    for index, row in enumerate(rows):
        if row[0] == SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[selected_indicators_count]:
            result.append(_IndicatorCSVData(
                SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[selected_indicators_count], index)
            )
            selected_indicators_count += 1
            if selected_indicators_count >= len(SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES):
                break
    return result


def _parse_telco_information(company_csv_data, quick_overview_mappings_by_company):
    current_overview_mapping = quick_overview_mappings_by_company[company_csv_data.column_name]
    telco_value = TELCO_TRUE if current_overview_mapping[QuickOverviewCSVMappings.type] == QuickOverviewCSVTypeFieldValues.telco \
        else TELCO_FALSE
    return OrderedDict([
        (CategoriesOverviewJsonFields.telco, telco_value)
    ])


def _parse_summed_indicators_for_company(company_csv_data, indicators_csv_data, scores_rows):
    result = OrderedDict()
    for indicator_csv_data in indicators_csv_data:
        indicator_value = scores_rows[indicator_csv_data.row_index][company_csv_data.column_index]
        indicator_json_field = SUMMED_INDICATORS_JSON_FIELDS_BY_NAMES[indicator_csv_data.indicator_name]
        result[indicator_json_field] = OrderedDict([
            (CategoriesOverviewJsonIndicatorSubFields.val, indicator_value)
        ])
    return result


def _create_initial_categories_overview_objects(scores_rows, quick_overview_mappings):
    quick_overview_mappings_by_company = {quick_mapping[QuickOverviewCSVMappings.company]: quick_mapping
                                          for quick_mapping in quick_overview_mappings}
    companies_csv_data = _determine_companies_csv_data(scores_rows)
    indicators_csv_data = _determine_summed_indicators_csv_data(scores_rows)
    categories_overview_objects = []
    for company_csv_data in companies_csv_data:
        categories_overview_object = OrderedDict([
            (CategoriesOverviewJsonFields.id,
             PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES[company_csv_data.column_name]),
            (CategoriesOverviewJsonFields.name,
             PREDEFINED_COMPANY_NAMES_BY_THEIR_DISPLAY_NAMES[company_csv_data.column_name]),
            (CategoriesOverviewJsonFields.display, company_csv_data.column_name),
        ])
        categories_overview_object.update(
            _parse_telco_information(company_csv_data, quick_overview_mappings_by_company)
        )
        categories_overview_object.update(
            _parse_summed_indicators_for_company(company_csv_data, indicators_csv_data, scores_rows)
        )
        categories_overview_objects.append(categories_overview_object)
    return categories_overview_objects


def _add_ranks(categories_overview_init_objs):
    rank_related_json_fields = [CategoriesOverviewJsonFields.total, CategoriesOverviewJsonFields.governance,
                                CategoriesOverviewJsonFields.freedom, CategoriesOverviewJsonFields.privacy]
    for rank_field in rank_related_json_fields:
        init_objs = deepcopy(categories_overview_init_objs)
        rank_sorted_objs = sorted(init_objs, key=lambda init_obj: float(init_obj[rank_field][CategoriesOverviewJsonIndicatorSubFields.val]),
                                  reverse=True)
        rank_by_id = {obj[CategoriesOverviewJsonFields.id]: str(index + 1) for index, obj in enumerate(rank_sorted_objs)}
        for original_obj in categories_overview_init_objs:
            original_obj[rank_field].update(
                {CategoriesOverviewJsonIndicatorSubFields.rank: rank_by_id[original_obj[CategoriesOverviewJsonFields.id]]}
            )


def convert_scores_overview_type_csv_to_categories_overview_json(scores_csv_location, quick_overview_csv_location,
                                                                 output_directory, check_csv_structure=True):
    if check_csv_structure:
        checker = ScoresOverviewTypeCsvChecker(scores_csv_location)  # THIS CHECKER NEEDS TO CHANGE
        checker.check()
        check_overview_type_csv_structure(quick_overview_csv_location)
    _create_on_non_existent_categories_overview_subdirectory(output_directory)

    scores_rows = load_rows_as_list_of_lists(scores_csv_location)
    quick_overview_mappings = load_rows_as_list_of_dicts(quick_overview_csv_location)
    categories_overview_init_objs = _create_initial_categories_overview_objects(scores_rows, quick_overview_mappings)
    _add_ranks(categories_overview_init_objs)
    total_rank_sorted_objs = list(sorted(
        categories_overview_init_objs,
        key=lambda obj: int(obj[CategoriesOverviewJsonFields.total][CategoriesOverviewJsonIndicatorSubFields.rank])
    ))
    create_json_file(
        total_rank_sorted_objs, output_directory + CATEGORIES_OVERVIEW_SUBDIRECTORY + 'categories-overview.json',
        json_objects_already_sorted=True
    )

if __name__ == '__main__':
    args = parse_and_check_for_categories_overview_conversion()
    convert_scores_overview_type_csv_to_categories_overview_json(
        args.scores_csv_location, args.quick_overview_csv_location, args.output_directory)
