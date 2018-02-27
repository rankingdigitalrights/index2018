# coding=utf-8
import re
import os
from recordclass import recordclass
from collections import OrderedDict
from copy import deepcopy

try:
    from .helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, INDICATOR_IDS, COMPANIES_COLUMNS, \
        IndicatorOverviewJsonFields, PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES
    from .helpers.command_line_parser import parse_and_check
    from .helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from .csv_structure_checkers import ScoresOverviewTypeCsvChecker
except SystemError:
    from helpers.fields import SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS, INDICATOR_IDS, COMPANIES_COLUMNS, \
        IndicatorOverviewJsonFields, PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES
    from helpers.command_line_parser import parse_and_check
    from helpers.csv_json_rw import load_rows_as_list_of_lists, create_json_file
    from csv_structure_checkers import ScoresOverviewTypeCsvChecker

INDICATOR_SUBDIRECTORY = 'indicators/'
# sub_indicator means if indicator is Governance then its sub indicators are G1, G2, G3 etc.
COMPANY_NAMES_ROW_INDEX = 1  # default value it can be changed
SubIndicatorDescriptorData = recordclass('SubIndicatorDescriptorData', 'row_index first_cell_value')
SubIndicatorsBaseData = recordclass('SubIndicatorsBaseData', 'id name starting_row_index descriptors average_row_index')
# average_row_index is last row index related for sub indicator
CompanyServiceData = recordclass('CompanyServiceData', 'name column_index')
CompanyData = recordclass('CompanyData', 'name column_index')


def _create_indicators_subdirectory(output_directory):
    if not os.path.isdir(output_directory + INDICATOR_SUBDIRECTORY):
        os.mkdir(output_directory + INDICATOR_SUBDIRECTORY)


def _determine_service_indexes(si_base_data, company_data, rows):
    service_indexes = []
    for index, value in enumerate(rows[si_base_data.starting_row_index][company_data.column_index:]):
        if value:
            service_indexes.append(company_data.column_index + index)
        else:
            break
    return service_indexes


def _create_si_company_object(si_base_data, company_data, rows):
    service_indexes = _determine_service_indexes(si_base_data, company_data, rows)
    res = OrderedDict()
    res['id'] = PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES[company_data.name]
    res['name'] = company_data.name
    res['headers'] = [{'text': rows[si_base_data.starting_row_index][index]}
                      for index in service_indexes]
    res['average'] = [{'value': rows[si_base_data.average_row_index][index]}
                      for index in service_indexes]
    res['rows'] = []

    for descriptor in si_base_data.descriptors:
        res['rows'].append({'cells': [{'value': descriptor.first_cell_value}]})
        for service_index in service_indexes:
            res['rows'][-1]['cells'].append({'value': rows[descriptor.row_index][service_index]})

    return res


def _create_sub_indicator_json_data(si_base_data, companies_data, rows):
    # si - sub indicator
    res = OrderedDict()
    res['id'] = si_base_data.id
    res['name'] = si_base_data.name
    res['companies'] = [_create_si_company_object(si_base_data, company_data, rows) for company_data in companies_data]
    return res


def _create_companies_data(rows):
    return [CompanyData(value, index) for index, value in enumerate(rows[COMPANY_NAMES_ROW_INDEX]) if value]


def _get_all_sub_indicators_base_data(indicator, rows):
    sub_indicator_prefix = indicator[0].upper()
    sub_indicator_pattern = re.compile(sub_indicator_prefix + '\d+')
    res, sub_indicator_base_data = [], None
    for index, row in enumerate(rows):
        if sub_indicator_base_data is not None:  # this happens after row with sub indicator name is discovered
            # so that means that either descriptors or average rows are next ones
            if row[0].isdigit() and len(row[1]) > 0:
                sub_indicator_base_data.descriptors.append(SubIndicatorDescriptorData(index, row[1]))
            elif row[1].lower().strip() == 'average':  # this needs to be checked through structure checkers
                sub_indicator_base_data.average_row_index = index
                res.append(deepcopy(sub_indicator_base_data))
                sub_indicator_base_data = None
        elif len(sub_indicator_pattern.findall(row[0])) > 0:
            # this needs to be checked within csv structure, meaning that sub indicators names are on every first column
            sid, name, starting_row_index = row[0], row[1], index  # sid - sub indicator id like G1, G2, F1 etc.
            sub_indicator_base_data = SubIndicatorsBaseData(sid, name, starting_row_index, [], None)
    return res


def convert_sub_indicator_type_to_jsons(csv_location, output_directory,
                                        company_names_row_index=COMPANY_NAMES_ROW_INDEX):
    global COMPANY_NAMES_ROW_INDEX
    if company_names_row_index != COMPANY_NAMES_ROW_INDEX:
        COMPANY_NAMES_ROW_INDEX = company_names_row_index
    _create_indicators_subdirectory(output_directory)

    rows = load_rows_as_list_of_lists(csv_location)
    indicator = rows[0][0]  # this is either Governance, Freedom of Expression or Privacy
    sub_indicators_base_data = _get_all_sub_indicators_base_data(indicator, rows)
    companies_data = _create_companies_data(rows)

    sub_indicators_objects = [_create_sub_indicator_json_data(si_data, companies_data, rows)
                              for si_data in sub_indicators_base_data]

    for si_json, si_data in zip(sub_indicators_objects, sub_indicators_base_data):
        create_json_file(si_json, output_directory + INDICATOR_SUBDIRECTORY + si_data.id + '.json',
                         json_objects_already_sorted=True)


if __name__ == '__main__':
    args = parse_and_check()
    convert_sub_indicator_type_to_jsons(args.csv_location, args.output_directory)
