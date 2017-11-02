# coding=utf-8
from helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, INDICATOR_IDS, COMPANIES_COLUMNS, \
    IndicatorOverviewJsonFields
from helpers.core_classes import BaseChecker
from helpers.command_line_parser import parse_and_check
from helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
from helpers.errors import InvalidRowStructure, InvalidColumnNames


class ScoresOverviewTypeCsvChecker(BaseChecker):
    INVALID_BASE_STRUCTURE_ERR_MSG = BaseChecker.INVALID_BASE_STRUCTURE_ERR_MSG.format(
        ordered_rows=u', '.join(SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS))
    COMPLEX_ERROR_MSG = BaseChecker.COMPLEX_ERROR_MSG.format(invalid_base_structure_err_msg=INVALID_BASE_STRUCTURE_ERR_MSG)
    # INVALID_BASE_STRUCTURE_ERR_MSG = INVALID_BASE_STRUCTURE_ERR_MSG.encode('utf-8')
    MISSING_REQUIRED_COLUMN = BaseChecker.MISSING_REQUIRED_COLUMN.format(all_columns=', '.join(COMPANIES_COLUMNS))

    def __init__(self, csv_location):
        self.rows = load_rows_as_list_of_lists(csv_location)

    def _check_indicator_rows(self):
        first_columns = [row[0] for row in self.rows]
        if SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[0] not in first_columns:
            raise InvalidRowStructure(self.INVALID_BASE_STRUCTURE_ERR_MSG)
        first_indicator_index = first_columns.index(SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[0])
        for proper_index, csv_index in enumerate(
                range(first_indicator_index, first_indicator_index + len(SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS))):
            if first_columns[csv_index] != SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[proper_index]:
                complex_error_msg = self.COMPLEX_ERROR_MSG % (
                    SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[proper_index], first_columns[csv_index],
                    first_indicator_index + csv_index
                )
                raise InvalidRowStructure(complex_error_msg.encode('utf-8'))

    def _check_companies_columns(self):
        first_row = self.rows[0]  # all column names are in first row
        for required_column in COMPANIES_COLUMNS:
            if required_column not in first_row:
                raise InvalidColumnNames(self.MISSING_REQUIRED_COLUMN % required_column)

    def check(self):
        super(ScoresOverviewTypeCsvChecker, self).check()
        self._check_indicator_rows()
        self._check_companies_columns()


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
