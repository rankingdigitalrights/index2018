import os
try:
    from .helpers.fields import ORDERED_SERVICE_ROWS, ServiceCSVFields, ServiceJSONFields
    from .helpers.command_line_parser import parse_and_check
    from .helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from .csv_structure_checkers import MultipleServicesTypeCsvChecker
except SystemError:
    from helpers.fields import ORDERED_SERVICE_ROWS, ServiceCSVFields, ServiceJSONFields
    from helpers.command_line_parser import parse_and_check
    from helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from csv_structure_checkers import MultipleServicesTypeCsvChecker


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
        create_json_file(service_objects, service_filename)


def convert_multiple_services_type_csv_to_json(csv_location, output_directory):
    # check structure of multiple_services_type
    multiple_services_csv_type_checker = MultipleServicesTypeCsvChecker(csv_location)
    multiple_services_csv_type_checker.check()

    # parse services
    rows = load_rows_as_list_of_lists(csv_location)
    service_related_rows = _separate_service_related_rows(rows)
    for service_rows in service_related_rows:
        services_json_files_creator = _ServiceJsonFilesCreator(service_rows, output_directory)
        services_json_files_creator.create()


if __name__ == '__main__':
    args = parse_and_check()
    convert_multiple_services_type_csv_to_json(args.csv_location, args.output_directory)
