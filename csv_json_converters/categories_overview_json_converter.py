try:
    from .helpers.command_line_parser import parse_and_check_for_categories_overview_conversion
    from .csv_structure_checkers import ScoresOverviewTypeCsvChecker
    from .helpers.csv_json_rw import load_rows_as_list_of_lists, load_rows_as_list_of_dicts
    from .helpers.fields import PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES
except SystemError:
    from helpers.command_line_parser import parse_and_check_for_categories_overview_conversion
    from csv_structure_checkers import ScoresOverviewTypeCsvChecker
    from helpers.csv_json_rw import load_rows_as_list_of_lists, load_rows_as_list_of_dicts
    from helpers.fields import PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES


def _parse_categories_overview_object_data(rows):
    pass


def _add_rank_fields(categories_overview_init_objects):
    pass


def convert_scores_overview_type_csv_to_categories_overview_json(scores_csv_location, quick_overview_csv_location,
                                                                 output_directory, check_csv_structure=True):
    if check_csv_structure:
        checker = ScoresOverviewTypeCsvChecker(scores_csv_location)
        checker.check()
    scores_rows = load_rows_as_list_of_lists(scores_csv_location)


if __name__ == '__main__':
    args = parse_and_check_for_categories_overview_conversion()
    convert_scores_overview_type_csv_to_categories_overview_json(
        args.scores_csv_location, args.quick_overview_csv_location, args.output_directory)
