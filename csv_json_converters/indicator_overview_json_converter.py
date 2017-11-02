# coding=utf-8
try:
    from .helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, INDICATOR_IDS, COMPANIES_COLUMNS, \
        IndicatorOverviewJsonFields
    from .helpers.command_line_parser import parse_and_check
    from .helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from .csv_structure_checkers import ScoresOverviewTypeCsvChecker
except SystemError:
    from helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, INDICATOR_IDS, COMPANIES_COLUMNS, \
        IndicatorOverviewJsonFields
    from helpers.command_line_parser import parse_and_check
    from helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from csv_structure_checkers import ScoresOverviewTypeCsvChecker


class CompanyCSVData(object):
    def __init__(self, column_name, column_index):
        self.column_name, self.column_index = column_name, column_index


class IndicatorCSVData(object):
    def __init__(self, indicator_id, indicator_name, row_index):
        self.indicator_id, self.indicator_name, self.row_index = indicator_id, indicator_name, row_index


def determine_companies_csv_data(rows):
    first_row, result = rows[0], []
    return [CompanyCSVData(company, first_row.index(company)) for company in COMPANIES_COLUMNS]


def determine_indicators_csv_data(rows):
    result, selected_indicators_count = [], 0
    for index, row in enumerate(rows):
        if row[0] == SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[selected_indicators_count]:
            result.append(IndicatorCSVData(
                INDICATOR_IDS[selected_indicators_count], SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[selected_indicators_count], index)
            )
            selected_indicators_count += 1
    return result


def create_indicator_objects(rows):
    companies_csv_data = determine_companies_csv_data(rows)
    indicators_csv_data = determine_indicators_csv_data(rows)
    indicator_objects = []
    for indicator_csv_data in indicators_csv_data:
        indicator_row = rows[indicator_csv_data.row_index]
        indicator_scores = {company_csv_data.column_name: indicator_row[company_csv_data.column_index]
                            for company_csv_data in companies_csv_data}
        indicator_objects.append({
            IndicatorOverviewJsonFields.id: indicator_csv_data.indicator_id,
            IndicatorOverviewJsonFields.name: indicator_csv_data.indicator_name,
            IndicatorOverviewJsonFields.scores: indicator_scores
        })
    return indicator_objects


def convert_scores_overview_type_csv_to_indicator_overview_json(csv_location, output_directory,
                                                                check_csv_structure=True):
    if check_csv_structure:
        scores_overview_csv_type_checker = ScoresOverviewTypeCsvChecker(csv_location)
        scores_overview_csv_type_checker.check()
    rows = load_rows_as_list_of_lists(csv_location)
    indicator_objects = create_indicator_objects(rows)
    create_json_file(indicator_objects, output_directory + 'indicator-overview.json')


if __name__ == '__main__':
    args = parse_and_check()
    convert_scores_overview_type_csv_to_indicator_overview_json(args.csv_location, args.output_directory)
