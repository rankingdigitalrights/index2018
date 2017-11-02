import re
try:
    from .helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, COMPANIES_COLUMNS, ORDERED_SERVICE_ROWS
    from .helpers.csv_json_rw import load_rows_as_list_of_lists
    from .helpers.errors import InvalidRowStructure, InvalidColumnNames
except SystemError:
    from helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, COMPANIES_COLUMNS, ORDERED_SERVICE_ROWS
    from helpers.csv_json_rw import load_rows_as_list_of_lists
    from helpers.errors import InvalidRowStructure, InvalidColumnNames


class BaseChecker(object):
    INVALID_BASE_STRUCTURE_ERR_MSG = u'Invalid file structure it should have rows next first ' \
                                     u'columns (order must be same as presented here): {ordered_rows}.'
    FIELD_WHERE_IT_WENT_WRONG_ERR_MSG = u'It broke on field %s instead it got field with name %s.'
    ROW_NUMBER_ERR_MSG = u'Error happened on row %s.'
    COMPLEX_ERROR_MSG = u'{invalid_base_structure_err_msg}\n' + \
                        '\n'.join([FIELD_WHERE_IT_WENT_WRONG_ERR_MSG, ROW_NUMBER_ERR_MSG])
    MISSING_REQUIRED_COLUMN = u'Missing required column %s in input csv. \n' \
                              u'It should contain next columns: {all_columns}.'

    def __init__(self, csv_location):
        self.rows = load_rows_as_list_of_lists(csv_location)

    def check(self):
        pass


class MultipleServicesTypeCsvChecker(BaseChecker):
    INVALID_BASE_STRUCTURE_ERR_MSG = BaseChecker.INVALID_BASE_STRUCTURE_ERR_MSG.format(ordered_rows=', '.join(ORDERED_SERVICE_ROWS))
    COMPLEX_ERROR_MSG = BaseChecker.COMPLEX_ERROR_MSG.format(invalid_base_structure_err_msg=INVALID_BASE_STRUCTURE_ERR_MSG)

    def _check_service_start_row(self):
        first_row = ORDERED_SERVICE_ROWS[0]
        start_row_pattern = re.compile(first_row)
        for ind, row in enumerate(self.rows):
            if start_row_pattern.findall(row[0]) and row[0] != first_row:
                raise InvalidRowStructure(self.COMPLEX_ERROR_MSG % (first_row, row[0], ind))

    def _check_service_row_order(self, service_start_index):
        for correct_index, service_index in enumerate(range(service_start_index, service_start_index + len(ORDERED_SERVICE_ROWS))):
            row = self.rows[service_index]
            if row[0] != ORDERED_SERVICE_ROWS[correct_index]:
                raise InvalidRowStructure(self.COMPLEX_ERROR_MSG % (
                    ORDERED_SERVICE_ROWS[correct_index], row[0], service_start_index + service_index - 1
                ))

    def check(self):
        self._check_service_start_row()
        service_starts_indexes = [index for index, row in enumerate(self.rows) if row[0] == ORDERED_SERVICE_ROWS[0]]
        if len(service_starts_indexes) == 0:
            raise InvalidRowStructure(self.INVALID_BASE_STRUCTURE_ERR_MSG)
        for service_start_index in service_starts_indexes:
            self._check_service_row_order(service_start_index)


class ScoresOverviewTypeCsvChecker(BaseChecker):
    INVALID_BASE_STRUCTURE_ERR_MSG = BaseChecker.INVALID_BASE_STRUCTURE_ERR_MSG.format(
        ordered_rows=u', '.join(SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS))
    COMPLEX_ERROR_MSG = BaseChecker.COMPLEX_ERROR_MSG.format(invalid_base_structure_err_msg=INVALID_BASE_STRUCTURE_ERR_MSG)
    # INVALID_BASE_STRUCTURE_ERR_MSG = INVALID_BASE_STRUCTURE_ERR_MSG.encode('utf-8')
    MISSING_REQUIRED_COLUMN = BaseChecker.MISSING_REQUIRED_COLUMN.format(all_columns=', '.join(COMPANIES_COLUMNS))

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
        self._check_indicator_rows()
        self._check_companies_columns()
