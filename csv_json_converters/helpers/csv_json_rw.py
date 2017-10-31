# csv_json_rw - csv/json read and write operations
import csv
import json


def load_rows_as_list_of_dicts(csv_file_location):
    with open(csv_file_location, 'r') as overview_csv_file:
        rows = list(csv.DictReader(overview_csv_file))
    return rows


def load_rows_as_list_of_lists(csv_file_location):
    with open(csv_file_location, 'r') as overview_csv_file:
        rows = list(csv.reader(overview_csv_file))
    return rows


def create_json_file(json_objects, json_file_name):
    with open(json_file_name, 'w') as overview_json_file:
        json.dump(json_objects, overview_json_file, sort_keys=True, indent=4, ensure_ascii=False)
