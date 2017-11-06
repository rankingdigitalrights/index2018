import argparse
import os.path

CSV_LOCATION_HELP = 'Absolute path to csv that needs conversion.\n' \
                    'If file or folder contains whitespaces then use "csv_file_path".\n' \
                    'Example: -csv_location "/home/filip/Downloads/RDRindex2017data/RDR2017 - Quick overview.csv"'
OUTPUT_DIRECTORY_HELP = 'Absolute path to output directory. If not given output will be in same directory as script. ' \
                        'If directory contains whitespaces then use  "output_directory". ' \
                        'Example: "/home/filip/Output Folder".'
SCORES_CSV_LOCATION_HELP = \
    'Absolute path to scores csv that needs to be parsed.\n ' \
    'If file or folder contains whitespaces then use "scores_csv_file_path".\n ' \
    'Example: -scores_csv_location "/home/filip/Downloads/RDRindex2017data - Scores overview.csv"'
QUICK_OVERVIEW_CSV_LOCATION_HELP = \
    'Absolute path to quick overview csv that needs to be parsed.\n ' \
    'If file or folder contains whitespaces then use "quick_overview_csv_file_path".\n ' \
    'Example: -quick_overview_csv_location "/home/filip/Downloads/RDRindex2017data/RDR2017 - Quick overview.csv"'


class CSVLocationCheckAction(argparse.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        super(CSVLocationCheckAction, self).__init__(option_strings, dest, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None):
        if not os.path.isfile(values):
            raise IOError('File not found on location %s.' % values)
        setattr(namespace, self.dest, values)


class OutputDirectoryCheckAction(argparse.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        super(OutputDirectoryCheckAction, self).__init__(option_strings, dest, **kwargs)

    def __call__(self, parser, namespace, values, option_string=None):
        if not os.path.isdir(values):
            raise IOError('Directory not found on location %s.' % values)
        if not values.endswith('/'):
            values += '/'
        setattr(namespace, self.dest, values)


def parse_and_check():
    parser = argparse.ArgumentParser()
    parser.add_argument('-csv_location', action=CSVLocationCheckAction, help=CSV_LOCATION_HELP, required=True)
    parser.add_argument('--output_directory', action=OutputDirectoryCheckAction, help=OUTPUT_DIRECTORY_HELP,
                        required=False, default='')
    return parser.parse_args()


def parse_and_check_for_categories_overview_conversion():
    parser = argparse.ArgumentParser()
    parser.add_argument('-scores_csv_location', action=CSVLocationCheckAction, help=SCORES_CSV_LOCATION_HELP,
                        required=True)
    parser.add_argument('-quick_overview_csv_location', action=CSVLocationCheckAction,
                        help=QUICK_OVERVIEW_CSV_LOCATION_HELP, required=True)
    parser.add_argument('--output_directory', action=OutputDirectoryCheckAction, help=OUTPUT_DIRECTORY_HELP,
                        required=False, default='')
    return parser.parse_args()
