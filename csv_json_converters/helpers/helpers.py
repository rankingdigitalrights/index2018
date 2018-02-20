try:
    from .fields import COMPANIES_COLUMNS, YAHOO_MULTIPLE_NAMES
except SystemError:
    from fields import COMPANIES_COLUMNS, YAHOO_MULTIPLE_NAMES


def get_structured_company_data(rows, company_structure):
    first_row, result = rows[0], []
    for company in COMPANIES_COLUMNS:
        if company in YAHOO_MULTIPLE_NAMES:
            if company in first_row:
                result.append(company_structure(company, first_row.index(company)))
        else:
            result.append(company_structure(company, first_row.index(company)))
    # note: This is done more complicated on purpose to throw error if company does not exists
    return result
