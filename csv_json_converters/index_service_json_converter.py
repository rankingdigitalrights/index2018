from collections import OrderedDict
try:
    from .helpers.command_line_parser import parse_and_check
    from .csv_structure_checkers import MultipleServicesTypeCsvCheckerForIndexServiceJsonConversion
    from .helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from .row_parsers import separate_service_related_rows
    from .helpers.fields import ORDERED_SERVICE_ROWS, ServiceCSVFields, \
        IndexServiceJsonFields, PREDEFINED_SERVICE_IDS_BY_THEIR_NAMES
    from .helpers.service_id_reader import ServiceIdReader
except SystemError:
    from helpers.command_line_parser import parse_and_check
    from csv_structure_checkers import MultipleServicesTypeCsvCheckerForIndexServiceJsonConversion
    from helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from row_parsers import separate_service_related_rows
    from helpers.fields import ORDERED_SERVICE_ROWS, ServiceCSVFields, \
        IndexServiceJsonFields, PREDEFINED_SERVICE_IDS_BY_THEIR_NAMES
    from helpers.service_id_reader import ServiceIdReader


service_id_reader = ServiceIdReader()


def _create_index_service_objects(service_related_rows):
    result = []
    service_index_by_name = {value: index for index, value in enumerate(ORDERED_SERVICE_ROWS)}  # the first column
    #  is left out intentionally
    no_row_names_service_related_rows = [service_rows[1:] for service_rows in service_related_rows]
    service_index = service_index_by_name[ServiceCSVFields.service]
    services_names_row = list(filter(lambda non_empty: non_empty, no_row_names_service_related_rows[service_index]))
    total_row_index = service_index_by_name[ServiceCSVFields.total]
    company_row_index = service_index_by_name[ServiceCSVFields.company]

    for column_index, service_name in enumerate(services_names_row):
        service_column = [row[column_index] for row in no_row_names_service_related_rows]
        result.append(OrderedDict([
            (IndexServiceJsonFields.id, service_id_reader.get_id(service_name)),
            (IndexServiceJsonFields.total, service_column[total_row_index]),
            (IndexServiceJsonFields.service, service_name),
            (IndexServiceJsonFields.company, service_column[company_row_index])
        ]))

    return result


def convert_multiple_services_type_csv_to_index_service_json(csv_location, output_directory, check_csv_structure=True):
    if check_csv_structure:
        checker = MultipleServicesTypeCsvCheckerForIndexServiceJsonConversion(csv_location)
        checker.check()
    rows = load_rows_as_list_of_lists(csv_location)
    all_services_related_rows = separate_service_related_rows(rows)
    index_service_objects = []
    for services_related_rows in all_services_related_rows:
        index_service_objects += _create_index_service_objects(services_related_rows)

    create_json_file(sorted(index_service_objects, key=lambda ind_obj: int(ind_obj[IndexServiceJsonFields.id])),
                     output_directory + 'index-service.json', json_objects_already_sorted=True)

if __name__ == '__main__':
    args = parse_and_check()
    convert_multiple_services_type_csv_to_index_service_json(args.csv_location, args.output_directory)
