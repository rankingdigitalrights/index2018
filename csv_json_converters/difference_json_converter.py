# Governance 2017	Governance 2018	Difference i tako za sve parametre sem total-a
# za ovu tabelu vrednosti nisu u int-u nego u float-u

try:
    from .helpers.command_line_parser import parse_and_check
    from .helpers.fields import DIFFERENCE_COLUMN_NAMES, DifferenceCSVMappings, DifferenceJSONFields, \
        PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES
    from .helpers.csv_json_rw import load_rows_as_list_of_dicts, create_json_file
    from .csv_structure_checkers import check_difference_structure
except SystemError:
    from helpers.command_line_parser import parse_and_check
    from helpers.fields import DIFFERENCE_COLUMN_NAMES, DifferenceCSVMappings, DifferenceJSONFields, \
        PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES
    from helpers.csv_json_rw import load_rows_as_list_of_dicts, create_json_file
    from csv_structure_checkers import check_difference_structure


def _convert_to_json_object(row_as_dict):
    return {
        DifferenceJSONFields.id: PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES[row_as_dict[DifferenceCSVMappings.company]],
        DifferenceJSONFields.name: row_as_dict[DifferenceCSVMappings.company],
        DifferenceJSONFields.description: row_as_dict[DifferenceCSVMappings.description],
        DifferenceJSONFields.total_2017: float(row_as_dict[DifferenceCSVMappings.total_previous]),
        DifferenceJSONFields.total_2018: float(row_as_dict[DifferenceCSVMappings.total_next]),
        DifferenceJSONFields.total_difference: float(row_as_dict[DifferenceCSVMappings.total_difference]),
        DifferenceJSONFields.governance_2017: float(row_as_dict[DifferenceCSVMappings.governance_previous]),
        DifferenceJSONFields.governance_2018: float(row_as_dict[DifferenceCSVMappings.governance_next]),
        DifferenceJSONFields.governance_difference: float(row_as_dict[DifferenceCSVMappings.governance_difference]),
        DifferenceJSONFields.freedom_of_expression_2017: float(row_as_dict[DifferenceCSVMappings.freedom_of_expression_previous]),
        DifferenceJSONFields.freedom_of_expression_2018: float(row_as_dict[DifferenceCSVMappings.freedom_of_expression_next]),
        DifferenceJSONFields.freedom_of_expression_difference: float(row_as_dict[DifferenceCSVMappings.freedom_of_expression_difference]),
        DifferenceJSONFields.privacy_2017: float(row_as_dict[DifferenceCSVMappings.privacy_previous]),
        DifferenceJSONFields.privacy_2018: float(row_as_dict[DifferenceCSVMappings.privacy_next]),
        DifferenceJSONFields.privacy_difference: float(row_as_dict[DifferenceCSVMappings.privacy_difference])
    }


def convert_difference_type_to_json(csv_location, output_directory):
    check_difference_structure(csv_location)
    rows = load_rows_as_list_of_dicts(csv_location)
    json_objects = [_convert_to_json_object(row_as_dict) for row_as_dict in rows]
    create_json_file(json_objects, output_directory + 'difference.json')


if __name__ == '__main__':
    args = parse_and_check()
    convert_difference_type_to_json(args.csv_location, args.output_directory)
