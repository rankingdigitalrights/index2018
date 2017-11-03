import os
from copy import deepcopy
from collections import OrderedDict
try:
    from .csv_structure_checkers import ScoresOverviewTypeCsvChecker
    from .helpers.command_line_parser import parse_and_check
    from .helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from .helpers.fields import COMPANIES_DATA, SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, COMMITMENT_INDICATORS,\
        FREEDOM_INDICATORS, PRIVACY_INDICATORS, AllIndicatorsJsonFields, IndicatorSubObjectJsonFields
except SystemError:
    from csv_structure_checkers import ScoresOverviewTypeCsvChecker
    from helpers.command_line_parser import parse_and_check
    from helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from helpers.fields import COMPANIES_DATA, SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, COMMITMENT_INDICATORS,\
        FREEDOM_INDICATORS, PRIVACY_INDICATORS, AllIndicatorsJsonFields, IndicatorSubObjectJsonFields

INDICATORS_SUBTYPE_LIST_JSON_FIELD_PAIRS = list(zip(
    [COMMITMENT_INDICATORS, FREEDOM_INDICATORS, PRIVACY_INDICATORS],
    [AllIndicatorsJsonFields.commitment, AllIndicatorsJsonFields.freedom, AllIndicatorsJsonFields.privacy]
))
ALL_INDICATORS_SUBDIRECTORY = 'company/'


def _create_on_non_existent_all_indicators_subdirectory(output_directory):
    if not os.path.isdir(output_directory + ALL_INDICATORS_SUBDIRECTORY):
        os.mkdir(output_directory + ALL_INDICATORS_SUBDIRECTORY)


class _CompanyCSVData(object):
    def __init__(self, company_id, company_name, column_index):
        self.id, self.name, self.column_index = company_id, company_name, column_index


class _IndicatorCSVData(object):
    def __init__(self, indicator_name, row_index):
        self.indicator_name, self.row_index = indicator_name, row_index


def _determine_companies_csv_data(rows):
    first_row = rows[0]
    return [_CompanyCSVData(company_data.id, company_data.name, first_row.index(company_data.name))
            for company_data in COMPANIES_DATA]


def _determine_indicators_csv_data(rows):
    result, selected_indicators_count = [], 0
    for index, row in enumerate(rows):
        if row[0] == SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[selected_indicators_count]:
            result.append(
                _IndicatorCSVData(SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[selected_indicators_count], index)
            )
            selected_indicators_count += 1
    return result


# def _create_all_company_indicators()


def _create_all_indicators_objects(rows):
    result = []
    companies_csv_data, indicators_csv_data = _determine_companies_csv_data(rows), _determine_indicators_csv_data(rows)
    indicators_csv_data_by_name = {indicator_data.indicator_name: indicator_data
                                   for indicator_data in indicators_csv_data}
    for company_csv_data in companies_csv_data:
        company_indicators_object = OrderedDict([(AllIndicatorsJsonFields.id, company_csv_data.id)])
        for indicators_subtype_list, json_field in INDICATORS_SUBTYPE_LIST_JSON_FIELD_PAIRS:
            company_indicators_object[json_field] = []
            for indicator_field in indicators_subtype_list:
                indicator_data = indicators_csv_data_by_name[indicator_field]
                indicator_row = rows[indicator_data.row_index]
                company_indicator_value = indicator_row[company_csv_data.column_index]
                company_indicators_object[json_field].append({
                    IndicatorSubObjectJsonFields.name: indicator_data.indicator_name,
                    IndicatorSubObjectJsonFields.value: company_indicator_value
                })
        result.append(company_indicators_object)
    return result


def convert_scores_overview_type_csv_to_all_indicator_json(csv_location, output_directory, check_csv_structure=True):
    if check_csv_structure:
        scores_overview_type_checker = ScoresOverviewTypeCsvChecker(csv_location)
        scores_overview_type_checker.check()
    _create_on_non_existent_all_indicators_subdirectory(output_directory)
    rows = load_rows_as_list_of_lists(csv_location)
    all_indicators_objects = _create_all_indicators_objects(rows)
    create_json_file(all_indicators_objects, output_directory + ALL_INDICATORS_SUBDIRECTORY + 'all-indicators.json',
                     json_objects_already_sorted=True)

if __name__ == '__main__':
    args = parse_and_check()
    convert_scores_overview_type_csv_to_all_indicator_json(args.csv_location, args.output_directory)
