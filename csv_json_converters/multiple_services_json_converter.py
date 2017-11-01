import os
import helpers

ORDERED_SERVICE_ROWS = ['Category', 'Company', 'Service', 'Total', 'G', 'FoE', 'P']


class ServiceCSVFields(object):
    category = ORDERED_SERVICE_ROWS[0]
    company = ORDERED_SERVICE_ROWS[1]
    service = ORDERED_SERVICE_ROWS[2]
    total = ORDERED_SERVICE_ROWS[3]
    g = ORDERED_SERVICE_ROWS[4]
    foe = ORDERED_SERVICE_ROWS[5]
    p = ORDERED_SERVICE_ROWS[6]


class ServiceJSONFields(object):
    company = ServiceCSVFields.company
    service = ServiceCSVFields.service
    rank = 'rank'
    total = ServiceCSVFields.total
    g = ServiceCSVFields.g
    foe = ServiceCSVFields.foe
    p = ServiceCSVFields.p


class _MultipleServicesTypeCsvChecker(object):
    INVALID_BASE_STRUCTURE_ERR_MSG = 'Invalid file structure it should have rows next first ' \
                                     'columns (order must be same as presented here): %s.' % \
                                     ', '.join(ORDERED_SERVICE_ROWS)
    FIELD_WHERE_IT_WENT_WRONG_ERR_MSG = 'It broke on field %s instead it got field with name %s.'
    ROW_NUMBER_ERR_MSG = 'Error happened on row %s.'

    def __init__(self, csv_location):
        self.rows = helpers.csv_json_rw.load_rows_as_list_of_lists(csv_location)

    def _check_service_row_order(self, service_start_index):
        for correct_index, service_index in enumerate(range(service_start_index, service_start_index + len(ORDERED_SERVICE_ROWS))):
            row = self.rows[service_index]
            if row[0] != ORDERED_SERVICE_ROWS[correct_index]:
                field_where_it_went_wrong_err_msg = self.FIELD_WHERE_IT_WENT_WRONG_ERR_MSG % (
                    ORDERED_SERVICE_ROWS[correct_index], row[0])
                raise helpers.errors.InvalidRowStructure(' \n'.join([
                    self.INVALID_BASE_STRUCTURE_ERR_MSG, field_where_it_went_wrong_err_msg,
                    self.ROW_NUMBER_ERR_MSG % (service_start_index + service_index + 1)
                ]))

    def check(self):
        service_starts_indexes = [index for index, row in enumerate(self.rows) if row[0] == ORDERED_SERVICE_ROWS[0]]
        if len(service_starts_indexes) == 0:
            raise helpers.errors.InvalidRowStructure(self.INVALID_BASE_STRUCTURE_ERR_MSG)
        for service_start_index in service_starts_indexes:
            self._check_service_row_order(service_start_index)


def _separate_service_related_rows(all_rows):
    service_related_rows, skip_indexes = [], []
    for index, row in enumerate(all_rows):
        if index in skip_indexes:
            continue
        elif row[0] == ORDERED_SERVICE_ROWS[0]:
            service_related_rows.append(all_rows[index:index+len(ORDERED_SERVICE_ROWS)])
            skip_indexes.extend([ind for ind in range(index, index+len(ORDERED_SERVICE_ROWS))])
    return service_related_rows


class _ServiceObjectsCreator(object):
    column_indexes_by_row_names = {service_field: index for index, service_field in enumerate(ORDERED_SERVICE_ROWS)}
    fields = ServiceJSONFields

    def __init__(self, service_rows):
        self.service_rows = service_rows

    def _determine_number_of_services(self):
        service_row = self.service_rows[self.column_indexes_by_row_names[ServiceCSVFields.service]]
        return len([column_value for ind, column_value in enumerate(service_row) if ind > 0 and column_value])

    def _get_column_value(self, service_column, column_name):
        column_index = self.column_indexes_by_row_names[column_name]
        return service_column[column_index]

    def _parse_numeric_value(self, service_column, column_name):
        column_value = float(self._get_column_value(service_column, column_name))
        return str(int(round(column_value)))

    def _create_one(self, service_index):
        service_column = [row[service_index+1] for row in self.service_rows]
        return {
            ServiceJSONFields.company: self._get_column_value(service_column, ServiceCSVFields.company),
            ServiceJSONFields.service: self._get_column_value(service_column, ServiceCSVFields.service),
            ServiceJSONFields.total: self._parse_numeric_value(service_column, ServiceCSVFields.total),
            ServiceJSONFields.g: self._parse_numeric_value(service_column, ServiceCSVFields.g),
            ServiceJSONFields.foe: self._parse_numeric_value(service_column, ServiceCSVFields.foe),
            ServiceJSONFields.p: self._parse_numeric_value(service_column, ServiceCSVFields.p)
        }

    def create(self):
        number_of_services = self._determine_number_of_services()
        service_objs_without_rank = [self._create_one(service_index) for service_index in range(number_of_services)]
        sorted_service_objs_by_total = sorted(service_objs_without_rank,
                                              key=lambda service_obj: int(service_obj[ServiceJSONFields.total]),
                                              reverse=True)
        result = []
        for ind, service_obj_without_rank in enumerate(sorted_service_objs_by_total):
            service_obj_without_rank.update({ServiceJSONFields.rank: str(ind+1)})
            result.append(service_obj_without_rank)
        return result


class _ServiceJsonFilesCreator(object):
    SERVICES_DIRECTORY_NAME = 'services/'
    SERVICE_FILENAME_EXTENSION = 'services.json'

    def __init__(self, service_rows, output_directory):
        self.service_rows = service_rows
        self.service_objects_creator = _ServiceObjectsCreator(service_rows)
        self.output_directory = output_directory
        self._create_service_directory_if_non_existent()

    def _create_service_directory_if_non_existent(self):
        output_dir = self.output_directory + self.SERVICES_DIRECTORY_NAME
        if not os.path.isdir(output_dir):
            os.mkdir(output_dir)

    def _parse_service_filename(self):
        return self.output_directory + self.SERVICES_DIRECTORY_NAME + self.service_rows[0][1].replace(' ', '').lower()\
               + self.SERVICE_FILENAME_EXTENSION

    def create(self):
        service_filename = self._parse_service_filename()
        service_objects = self.service_objects_creator.create()
        helpers.csv_json_rw.create_json_file(service_objects, service_filename)


def convert_multiple_services_type_csv_to_json(csv_location, output_directory):
    # check structure of multiple_services_type
    multiple_services_csv_type_checker = _MultipleServicesTypeCsvChecker(csv_location)
    multiple_services_csv_type_checker.check()

    # parse services
    rows = helpers.csv_json_rw.load_rows_as_list_of_lists(csv_location)
    service_related_rows = _separate_service_related_rows(rows)
    for service_rows in service_related_rows:
        services_json_files_creator = _ServiceJsonFilesCreator(service_rows, output_directory)
        services_json_files_creator.create()


if __name__ == '__main__':
    args = helpers.command_line_parser.parse_and_check()
    convert_multiple_services_type_csv_to_json(args.csv_location, args.output_directory)
