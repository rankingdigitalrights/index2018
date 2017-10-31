import csv
import helpers

REQUIRED_COLUMN_NAMES = ['', 'type', 'Total', 'Governance', 'Freedom of Expression', 'Privacy']  # order is important


class CSVMappings(object):
    company = REQUIRED_COLUMN_NAMES[0]
    type = REQUIRED_COLUMN_NAMES[1]
    total = REQUIRED_COLUMN_NAMES[2]
    governance = REQUIRED_COLUMN_NAMES[3]
    freedom_of_expression = REQUIRED_COLUMN_NAMES[4]
    privacy = REQUIRED_COLUMN_NAMES[5]


class CSVTypeFieldValues(object):
    internet = 'Internet'
    telco = 'Telco'


def check_overview_type_csv_structure(csv_file_location):
    with open(csv_file_location, 'r') as overview_csv_file:
        quick_overview_dict_reader = csv.DictReader(overview_csv_file)
        if quick_overview_dict_reader.fieldnames != REQUIRED_COLUMN_NAMES:
            raise helpers.errors.InvalidColumnNames(
                'First rows in columns should have been: %s' % ', '.join(REQUIRED_COLUMN_NAMES))
        rows = list(quick_overview_dict_reader)
        if any([row[CSVMappings.type] not in [CSVTypeFieldValues.internet, CSVTypeFieldValues.telco] for row in rows]):
            raise ValueError('In column %s there is unrecognized value. Allowed values for column: %s' % (
                CSVMappings.type, ', '.join([CSVTypeFieldValues.internet, CSVTypeFieldValues.telco])
            ))


def convert_to_json_object(row):
    return {
        'commitment': row[CSVMappings.governance], 'display': row[CSVMappings.company],
        'freedom': row[CSVMappings.freedom_of_expression], 'id': row[CSVMappings.company].lower(),
        'name': row[CSVMappings.company].lower(), 'privacy': row[CSVMappings.privacy],
        'telco': 'true' if row[CSVMappings.type] == CSVTypeFieldValues.telco else 'false'
    }


def convert_rows_to_json_objects(rows):
    return [convert_to_json_object(row) for row in rows]


def convert_overview_type_csv_to_json(csv_location, output_directory):
    check_overview_type_csv_structure(csv_location)
    rows = helpers.csv_json_rw.load_rows_as_list_of_dicts(csv_location)
    json_objects = convert_rows_to_json_objects(rows)
    helpers.csv_json_rw.create_json_file(json_objects, output_directory + 'overview.json')

if __name__ == '__main__':
    args = helpers.command_line_parser.parse_and_check()
    convert_overview_type_csv_to_json(args.csv_location, args.output_directory)
