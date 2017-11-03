try:
    from .helpers.fields import ORDERED_SERVICE_ROWS
except SystemError:
    from helpers.fields import ORDERED_SERVICE_ROWS


def separate_service_related_rows(all_rows):
    service_related_rows, skip_indexes = [], []
    for index, row in enumerate(all_rows):
        if index in skip_indexes:
            continue
        elif row[0] == ORDERED_SERVICE_ROWS[0]:
            service_related_rows.append(all_rows[index:index+len(ORDERED_SERVICE_ROWS)])
            skip_indexes.extend([ind for ind in range(index, index+len(ORDERED_SERVICE_ROWS))])
    return service_related_rows
