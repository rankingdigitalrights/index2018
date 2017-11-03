try:
    from .helpers.command_line_parser import parse_and_check
    from .helpers.fields import QUICK_OVERVIEW_COLUMN_NAMES, QuickOverviewCSVMappings, \
        QuickOverviewCSVTypeFieldValues, OverviewJsonFields, PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES, TELCO_TRUE,\
        TELCO_FALSE
    from .helpers.csv_json_rw import load_rows_as_list_of_dicts, create_json_file
    from .csv_structure_checkers import check_overview_type_csv_structure
except SystemError:
    from helpers.command_line_parser import parse_and_check
    from helpers.fields import QUICK_OVERVIEW_COLUMN_NAMES, QuickOverviewCSVMappings, \
        QuickOverviewCSVTypeFieldValues, OverviewJsonFields, PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES, TELCO_TRUE,\
        TELCO_FALSE
    from helpers.csv_json_rw import load_rows_as_list_of_dicts, create_json_file
    from csv_structure_checkers import check_overview_type_csv_structure


def _convert_to_json_object(row):
    same_values_json_field_csv_mapping_pairs = zip(
        [OverviewJsonFields.commitment, OverviewJsonFields.display, OverviewJsonFields.freedom, OverviewJsonFields.privacy],
        [QuickOverviewCSVMappings.governance, QuickOverviewCSVMappings.company, QuickOverviewCSVMappings.freedom_of_expression, QuickOverviewCSVMappings.privacy],
    )
    result = {json_field: row[csv_mapping] for json_field, csv_mapping in same_values_json_field_csv_mapping_pairs}
    result.update({
        OverviewJsonFields.name: row[QuickOverviewCSVMappings.company].lower(),
        OverviewJsonFields.id: PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES[row[QuickOverviewCSVMappings.company]],
        OverviewJsonFields.telco: TELCO_TRUE if row[QuickOverviewCSVMappings.type] == QuickOverviewCSVTypeFieldValues.telco else TELCO_FALSE
    })
    return result


def _convert_rows_to_json_objects(rows):
    return [_convert_to_json_object(row) for row in rows]


def convert_overview_type_csv_to_json(csv_location, output_directory):
    check_overview_type_csv_structure(csv_location)
    rows = load_rows_as_list_of_dicts(csv_location)
    json_objects = _convert_rows_to_json_objects(rows)
    create_json_file(json_objects, output_directory + 'overview.json')

if __name__ == '__main__':
    args = parse_and_check()
    convert_overview_type_csv_to_json(args.csv_location, args.output_directory)
