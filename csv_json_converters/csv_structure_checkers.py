import re
import csv

try:
    from .helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, COMPANIES_COLUMNS, ORDERED_SERVICE_ROWS, \
        ServiceCSVFields, PREDEFINED_SERVICE_IDS_BY_THEIR_NAMES, QUICK_OVERVIEW_COLUMN_NAMES, QuickOverviewCSVMappings,\
        QuickOverviewCSVTypeFieldValues, PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES, \
        SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES, DIFFERENCE_COLUMN_NAMES, DifferenceCSVMappings, \
        YAHOO_MULTIPLE_NAMES
    from .helpers.csv_json_rw import load_rows_as_list_of_lists
    from .helpers.errors import InvalidRowStructure, InvalidColumnNames
    from .helpers.service_id_reader import ServiceIdReader
except SystemError:
    from helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, COMPANIES_COLUMNS, ORDERED_SERVICE_ROWS, \
        ServiceCSVFields, PREDEFINED_SERVICE_IDS_BY_THEIR_NAMES, QUICK_OVERVIEW_COLUMN_NAMES, QuickOverviewCSVMappings,\
        QuickOverviewCSVTypeFieldValues, PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES, \
        SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES, DIFFERENCE_COLUMN_NAMES, DifferenceCSVMappings, \
        YAHOO_MULTIPLE_NAMES
    from helpers.csv_json_rw import load_rows_as_list_of_lists
    from helpers.errors import InvalidRowStructure, InvalidColumnNames
    from helpers.service_id_reader import ServiceIdReader


def check_overview_type_csv_structure(csv_file_location):
    with open(csv_file_location, 'r') as overview_csv_file:
        quick_overview_dict_reader = csv.DictReader(overview_csv_file)
        if quick_overview_dict_reader.fieldnames != QUICK_OVERVIEW_COLUMN_NAMES:
            raise InvalidColumnNames(
                'First rows in columns should have been: %s' % ', '.join(QUICK_OVERVIEW_COLUMN_NAMES))
        rows = list(quick_overview_dict_reader)
        type_field_values = [QuickOverviewCSVTypeFieldValues.internet, QuickOverviewCSVTypeFieldValues.telco]
        if any([row[QuickOverviewCSVMappings.type] not in type_field_values for row in rows]):
            raise ValueError('In column %s there is unrecognized value. Allowed values for column: %s' % (
                QuickOverviewCSVMappings.type, ', '.join(type_field_values)
            ))
        companies = [row[QuickOverviewCSVMappings.company] for row in rows]
        required_companies = PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES.keys()
        if not any([yahoo_name in companies for yahoo_name in YAHOO_MULTIPLE_NAMES]):
            msg = 'File must contain one of yahoo names: %s.' % ', '.join(YAHOO_MULTIPLE_NAMES)
            raise InvalidColumnNames(msg)
        for required_company in required_companies:
            if required_company not in companies and required_company not in YAHOO_MULTIPLE_NAMES:
                base_msg = 'File not containing required company %s.' % required_company
                required_companies_msg = 'Required Companies are: %s.' % [rc for rc in required_companies
                                                                          if rc not in YAHOO_MULTIPLE_NAMES]
                yahoo_msg = 'Also it must contain one or all yahoo company names: %s.' % YAHOO_MULTIPLE_NAMES
                raise InvalidColumnNames('\n'.join([base_msg, required_companies_msg, yahoo_msg]))


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
    INVALID_BASE_STRUCTURE_ERR_MSG = BaseChecker.INVALID_BASE_STRUCTURE_ERR_MSG.format(
        ordered_rows=', '.join(ORDERED_SERVICE_ROWS))
    COMPLEX_ERROR_MSG = BaseChecker.COMPLEX_ERROR_MSG.format(
        invalid_base_structure_err_msg=INVALID_BASE_STRUCTURE_ERR_MSG)

    def _check_service_start_row(self):
        first_row = ORDERED_SERVICE_ROWS[0]
        start_row_pattern = re.compile(first_row)
        for ind, row in enumerate(self.rows):
            if start_row_pattern.findall(row[0]) and row[0] != first_row:
                raise InvalidRowStructure(self.COMPLEX_ERROR_MSG % (first_row, row[0], ind))

    def _check_service_row_order(self, service_start_index):
        for correct_index, service_index in enumerate(
                range(service_start_index, service_start_index + len(ORDERED_SERVICE_ROWS))):
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


class MultipleServicesTypeCsvCheckerForIndexServiceJsonConversion(MultipleServicesTypeCsvChecker):
    NO_PREDEFINED_SERVICES_ERR_MSG = 'Could not find required service %s in csv.\n' \
                                     'Required services are {required_services}.' \
                                     '\nServices contained in this csv are: %s.'\
        .format(required_services=', '.join(PREDEFINED_SERVICE_IDS_BY_THEIR_NAMES.keys()))

    def _required_check_predefined_service_names(self):
        service_names_rows = [list(filter(lambda clmn: len(clmn) > 0 and clmn != ServiceCSVFields.service, row))
                              for row in self.rows if row[0] == ServiceCSVFields.service]
        all_services_in_current_csv = []
        for service_names_row in service_names_rows:
            all_services_in_current_csv += service_names_row

        service_id_reader = ServiceIdReader()
        for input_service in all_services_in_current_csv:
            service_id_reader.get_id(input_service, True)  # this will throw exception on unrecognized service
        # for predefined_service_name in PREDEFINED_SERVICE_IDS_BY_THEIR_NAMES.keys():
        #     if predefined_service_name not in all_services_in_current_csv:
        #         raise InvalidRowStructure(self.NO_PREDEFINED_SERVICES_ERR_MSG % (
        #             predefined_service_name, ', '.join(all_services_in_current_csv)
        #         ))

    def check(self):
        super(MultipleServicesTypeCsvCheckerForIndexServiceJsonConversion, self).check()
        self._required_check_predefined_service_names()


class ScoresOverviewTypeCsvChecker(BaseChecker):
    INVALID_BASE_STRUCTURE_ERR_MSG = BaseChecker.INVALID_BASE_STRUCTURE_ERR_MSG.format(
        ordered_rows=u', '.join(SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS))
    COMPLEX_ERROR_MSG = BaseChecker.COMPLEX_ERROR_MSG.format(
        invalid_base_structure_err_msg=INVALID_BASE_STRUCTURE_ERR_MSG)
    # INVALID_BASE_STRUCTURE_ERR_MSG = INVALID_BASE_STRUCTURE_ERR_MSG.encode('utf-8')
    MISSING_REQUIRED_COLUMN = '\n'.join([
        'Missing required column %s in input csv.',
        'Required columns are: %s.' % [cc for cc in COMPANIES_COLUMNS if cc not in YAHOO_MULTIPLE_NAMES],
        'Also it must contain one or all yahoo company names: %s.' % YAHOO_MULTIPLE_NAMES
    ])
    MISSING_YAHOO_COLUMN = 'File not containing either of one yahoo company names in required columns!\n' \
                           'Yahoo company names can be: %s.' % ', '.join(YAHOO_MULTIPLE_NAMES)

    def _check_indicator_rows(self):
        first_columns = [row[0] for row in self.rows]
        if SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[0] not in first_columns:
            raise InvalidRowStructure(self.INVALID_BASE_STRUCTURE_ERR_MSG)
        first_indicator_index = first_columns.index(SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[0])
        for proper_index, csv_index in enumerate(
                range(first_indicator_index,
                      first_indicator_index + len(SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS))):
            if first_columns[csv_index] != SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[proper_index]:
                complex_error_msg = self.COMPLEX_ERROR_MSG % (
                    SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS[proper_index], first_columns[csv_index],
                    first_indicator_index + csv_index
                )
                raise InvalidRowStructure(complex_error_msg)

    def _check_companies_columns(self):
        first_row = self.rows[0]  # all column names are in first row
        if not any([yahoo_name in first_row for yahoo_name in YAHOO_MULTIPLE_NAMES]):
            raise InvalidColumnNames(self.MISSING_YAHOO_COLUMN)
        for required_column in filter(lambda comp: comp not in YAHOO_MULTIPLE_NAMES, COMPANIES_COLUMNS):
            if required_column not in first_row:
                raise InvalidColumnNames(self.MISSING_REQUIRED_COLUMN % required_column)

    def check(self):
        self._check_indicator_rows()
        self._check_companies_columns()


class ScoresOverviewTypeCsvCheckerForCategoryOverviewConversion(ScoresOverviewTypeCsvChecker):
    INVALID_BASE_STRUCTURE_ERR_MSG = BaseChecker.INVALID_BASE_STRUCTURE_ERR_MSG.format(
        ordered_rows=u', '.join(SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES))
    COMPLEX_ERROR_MSG = BaseChecker.COMPLEX_ERROR_MSG.format(
        invalid_base_structure_err_msg=INVALID_BASE_STRUCTURE_ERR_MSG)

    def _check_indicator_rows(self):  # it  checks different indicators so it overrides this method
        first_columns = [row[0] for row in self.rows]
        if SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[0] not in first_columns:
            raise InvalidRowStructure(self.INVALID_BASE_STRUCTURE_ERR_MSG)
        first_indicator_index = first_columns.index(SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[0])
        last_indicator_index = first_indicator_index + len(SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES)
        for proper_index, csv_index in enumerate(range(first_indicator_index, last_indicator_index)):
            if first_columns[csv_index] != SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[proper_index]:
                complex_error_msg = self.COMPLEX_ERROR_MSG % (
                    SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[proper_index], first_columns[csv_index],
                    first_indicator_index + csv_index
                )
                raise InvalidRowStructure(complex_error_msg)


def check_difference_structure(csv_file_location):
    err_msg_end = 'First rows in columns should have been: %s.' % ', '.join(DIFFERENCE_COLUMN_NAMES)
    with open(csv_file_location, 'r') as difference_csv_file:
        difference_dict_reader = csv.DictReader(difference_csv_file)
        if len(difference_dict_reader.fieldnames) != len(DIFFERENCE_COLUMN_NAMES):
            raise InvalidColumnNames('Difference table has different number of columns than required. ' + err_msg_end)
        for extracted_field, predefined_field in zip(difference_dict_reader.fieldnames, DIFFERENCE_COLUMN_NAMES):
            if extracted_field != predefined_field:
                raise InvalidColumnNames('File contains column %s that should instead have value of %s. ' % (extracted_field, predefined_field) + err_msg_end)
        # rows = list(difference_dict_reader)
        # id conversion might be required
        # companies = [row[QuickOverviewCSVMappings.company] for row in rows]
        # required_companies = PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES.keys()
        # for required_company in required_companies:
        #     if required_company not in companies:
        #         raise InvalidColumnNames('File not containing required company %s.\nRequired Companies are: %s.' % (
        #             required_company, ', '.join(required_companies)))
