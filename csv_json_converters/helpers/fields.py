# coding=utf-8
from collections import OrderedDict

QUICK_OVERVIEW_COLUMN_NAMES = ['', 'type', 'Total', 'Governance', 'Freedom of Expression', 'Privacy']  # order is important


class QuickOverviewCSVMappings(object):
    company = QUICK_OVERVIEW_COLUMN_NAMES[0]
    type = QUICK_OVERVIEW_COLUMN_NAMES[1]
    total = QUICK_OVERVIEW_COLUMN_NAMES[2]
    governance = QUICK_OVERVIEW_COLUMN_NAMES[3]
    freedom_of_expression = QUICK_OVERVIEW_COLUMN_NAMES[4]
    privacy = QUICK_OVERVIEW_COLUMN_NAMES[5]


class QuickOverviewCSVTypeFieldValues(object):
    internet = 'Internet'
    telco = 'Telco'


TELCO_TRUE, TELCO_FALSE = 'true', 'false'


class OverviewJsonFields(object):
    commitment = 'commitment'
    display = 'display'
    freedom = 'freedom'
    id = 'id'
    name = 'name'
    privacy = 'privacy'
    telco = 'telco'
    total = 'total'


ORDERED_SERVICE_ROWS = ['Category', 'Company', 'Service', 'Total', 'Difference', 'G', 'FoE', 'P', 'Description']


class ServiceCSVFields(object):
    category = ORDERED_SERVICE_ROWS[0]
    company = ORDERED_SERVICE_ROWS[1]
    service = ORDERED_SERVICE_ROWS[2]
    total = ORDERED_SERVICE_ROWS[3]
    difference = ORDERED_SERVICE_ROWS[4]
    g = ORDERED_SERVICE_ROWS[5]
    foe = ORDERED_SERVICE_ROWS[6]
    p = ORDERED_SERVICE_ROWS[7]
    description = ORDERED_SERVICE_ROWS[8]


class ServiceJSONFields(object):
    company = ServiceCSVFields.company
    service = ServiceCSVFields.service
    rank = 'rank'
    total = ServiceCSVFields.total
    difference = ServiceCSVFields.difference
    g = ServiceCSVFields.g
    foe = ServiceCSVFields.foe
    p = ServiceCSVFields.p
    description = ServiceCSVFields.description


SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS = [
    u'G1. Policy Commitment', u'G2. Governance and management oversight', u'G3. Internal implementation',
    u'G4. Impact assessment', u'G5. Stakeholder engagement', u'G6. Remedy', u'F1. Access to terms of service',
    u'F2. Changes to terms of service', u'F3. Process for terms of service enforcement', u'F4. Data about terms of service enforcement',
    u'F5. Process for responding to third-party requests for content or account restriction',
    u'F6. Data about government requests for content or account restriction', u'F7. Data about private requests for content or account restriction',
    u'F8. User notification about content and account restriction', u'F9. Network management (telecommunications companies)',
    u'F10. Network shutdown (telecommunications companies)', u'F11. Identity policy', u'P1. Access to privacy policies',
    u'P2. Changes to privacy policies', u'P3. Collection of user information', u'P4. Sharing of user information',
    u'P5. Purpose for collecting and sharing user information', u'P6. Retention of user information',
    u'P7. Users’ control over their own user information', u'P8. Users’ access to their own user information',
    u'P9. Collection of user information from third parties (Internet companies)',
    u'P10. Process for responding to third-party requests for user information',
    u'P11. Data about third-party requests for user information', u'P12. User notification about third-party requests for user information',
    u'P13. Security oversight', u'P14. Addressing security vulnerabilities', u'P15. Data breaches',
    u'P16. Encryption of user communication and private content (Internet, software, and device companies)',
    u'P17. Account Security (Internet, software, and device companies)', u'P18. Inform and educate users about potential risks']
INDICATOR_IDS = [
    u'G1', u'G2', u'G3', u'G4', u'G5', u'G6', u'F1', u'F2', u'F3', u'F4', u'F5', u'F6', u'F7', u'F8',
    u'F9', u'F10', u'F11', u'P1', u'P2', u'P3', u'P4', u'P5', u'P6', u'P7', u'P8', u'P9', u'P10', u'P11',
    u'P12', u'P13', u'P14', u'P15', u'P16', u'P17', u'P18']

COMMITMENT_INDICATORS = [indicator for indicator in SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS if indicator.startswith('G')]
FREEDOM_INDICATORS = [indicator for indicator in SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS if indicator.startswith('F')]
PRIVACY_INDICATORS = [indicator for indicator in SCORES_OVERVIEW_CSV_INDICATOR_FULL_NAMES_ROWS if indicator.startswith('P')]

COMPANIES_COLUMNS = [
    'América Móvil', 'Apple', 'AT&T', 'Axiata', 'Baidu', 'Bharti Airtel', 'Etisalat', 'Facebook', 'Google', 'Kakao',
    'Mail.Ru', 'Microsoft', 'MTN', 'Ooredoo', 'Orange', 'Samsung', 'Telefónica', 'TenCent', 'Twitter', 'Vodafone',
    'Yahoo', 'Yandex', 'Oath (Yahoo)'
]

YAHOO_MULTIPLE_NAMES = ['Yahoo', 'Oath (Yahoo)']

COMPANIES_IDS = [
    'americamovil', 'apple', 'att', 'axiata', 'baidu', 'bhartiairtel', 'etisalat', 'facebook', 'google', 'kakao',
    'mailru', 'microsoft', 'mtn', 'ooredoo', 'orange', 'samsung', 'telefonica', 'tencent', 'twitter', 'vodafone',
    'yahoo', 'yandex', 'yahoo'
]
# COMPANIES_COLUMNS AND COMPANIES_IDS MUST BE CHANGED AT SAME TIME IF ONE IS MODIFIED WITHOUT OTHER IT WILL CREATE
# A LOT OF ERRORS!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
_COMPANIES_ID_NAME_PAIRS = zip(COMPANIES_IDS, COMPANIES_COLUMNS)


class CompanyData(object):
    def __init__(self, company_id, company_name):
        self.id, self.name = company_id, company_name


COMPANIES_DATA = [CompanyData(company_id, company_name) for company_id, company_name in _COMPANIES_ID_NAME_PAIRS]


class IndicatorOverviewJsonFields(object):
    id = 'id'
    name = 'name'
    scores = 'scores'


class AllIndicatorsJsonFields(object):
    id = 'id'
    commitment = 'commitment'
    freedom = 'freedom'
    privacy = 'privacy'


class IndicatorSubObjectJsonFields(object):
    name = 'name'
    value = 'value'


PREDEFINED_SERVICE_IDS_BY_THEIR_NAMES = OrderedDict([
    ('Baidu Cloud', '1'), ('Yandex Disk', '2'), ('iCloud', '3'), ('Daum Mail ', '4'), ('Mail.Ru', '5'),
    ('Outlook.com', '6'), ('Yahoo Mail', '7'), ('Yandex Mail', '8'), ('Gmail', '9'), ('WhatsApp', '17'),
    ('Messenger', '18'), ('KakaoTalk', '19'), ('Mail.Ru Agent', '20'), ('Skype', '21'), ('iMessage', '22'),
    ('WeChat', '23'), ('QQ', '24'), ('iOS', '25'), ('Google Android', '26'), ('Samsung Android', '27'),
    ('Telcel', '28'), ('AT&T', '29'), ('Celcom', '30'), ('Airtel India', '31'), ('Etisalat UAE', '32'),
    ('MTN South Africa', '33'), ('Ooredoo Qatar', '34'), ('Orange France', '35'), ('Movistar', '36'),
    ('Vodafone UK', '37'), ('Baidu Search', '38'), ('Daum Search ', '39'), ('Bing', '40'), ('Yandex Search', '41'),
    ('Google Search', '42'), ('Baidu PostBar', '43'), ('Facebook', '44'), ('VKontakte', '45'), ('Twitter', '46'),
    ('Tumblr', '47'), ('QZone', '48'), ('Instagram', '49'), ('Vine', '50'), ('Periscope', '51'), ('Flickr', '52'),
    ('YouTube', '53')
])


class IndexServiceJsonFields(object):
    id = 'id'
    total = 'total'
    service = 'service'
    company = 'company'


PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES = OrderedDict([
    ('Google', 'google'), ('Microsoft', 'microsoft'), ('Yahoo', 'yahoo'), ('Twitter', 'twitter'), ('Kakao', 'kakao'),
    ('Facebook', 'facebook'), ('Apple', 'apple'), ('AT&T', 'att'), ('Vodafone', 'vodafone'), ('Yandex', 'yandex'),
    ('TenCent', 'tencent'), ('Samsung', 'samsung'), ('Telefónica', 'telefonica'), ('Mail.Ru', 'mailru'),
    ('Orange', 'orange'), ('América Móvil', 'americamovil'), ('Axiata', 'axiata'), ('Baidu', 'baidu'),
    ('Bharti Airtel', 'bhartiairtel'), ('MTN', 'mtn'), ('Etisalat', 'etisalat'), ('Ooredoo', 'ooredoo'),
    ('Oath (Yahoo)', 'yahoo')
])
PREDEFINED_COMPANY_NAMES_BY_THEIR_DISPLAY_NAMES = OrderedDict([
    ('Google', 'google'), ('Microsoft', 'microsoft'), ('Yahoo', 'yahoo'), ('Twitter', 'twitter'), ('Kakao', 'kakao'),
    ('Facebook', 'facebook'), ('Apple', 'apple'), ('AT&T', 'at&t'), ('Vodafone', 'vodafone'), ('Yandex', 'yandex'),
    ('TenCent', 'tencent'), ('Samsung', 'samsung'), ('Telefónica', 'telefonica'), ('Mail.Ru', 'mailRu'),
    ('Orange', 'orange'), ('América Móvil', 'americaMovil'), ('Axiata', 'axiata'), ('Baidu', 'baidu'),
    ('Bharti Airtel', 'bhartiAirtel'), ('MTN', 'mtn'), ('Etisalat', 'etisalat'), ('Ooredoo', 'ooredoo'),
    ('Oath (Yahoo)', 'yahoo')
])

if sorted(PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES.keys()) != sorted(COMPANIES_COLUMNS):
    raise RuntimeError('Someone messed with values of variables: %s.' % ' and '.join(
        [name for name, val in locals().items() if val in [PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES, COMPANIES_COLUMNS]]
    ))

if sorted(PREDEFINED_COMPANY_NAMES_BY_THEIR_DISPLAY_NAMES.keys()) != sorted(PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES.keys()):
    raise RuntimeError('Someone messed with values of variables: %s.' % ' and '.join(
        [name for name, val in locals().items() if
         val in [PREDEFINED_COMPANY_NAMES_BY_THEIR_DISPLAY_NAMES, PREDEFINED_COMPANY_IDS_BY_THEIR_DISPLAY_NAMES]]
    ))

SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES = ['Total', 'Governance', 'Freedom of Expression', 'Privacy']


class CategoriesOverviewJsonFields(object):
    display = 'display'
    freedom = 'freedom'
    id = 'id'
    name = 'name'
    governance = 'governance'
    privacy = 'privacy'
    telco = 'telco'
    total = 'total'


SUMMED_INDICATORS_JSON_FIELDS_BY_NAMES = {
    SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[0]: CategoriesOverviewJsonFields.total,
    SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[1]: CategoriesOverviewJsonFields.governance,
    SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[2]: CategoriesOverviewJsonFields.freedom,
    SCORES_OVERVIEW_CSV_SUMMED_INDICATORS_NAMES[3]: CategoriesOverviewJsonFields.privacy
}


class CategoriesOverviewJsonIndicatorSubFields(object):
    val = 'val'
    rank = 'rank'


DIFFERENCE_COLUMN_NAMES = ['', 'type', 'Total 2017', 'Total 2018',	'Total Difference', 'Description', 'Governance 2017',
                           'Governance 2018', 'Governance Difference', 'Freedom of Expression 2017',
                           'Freedom of Expression 2018', 'Freedom of Expression Difference',
                           'Privacy 2017', 'Privacy 2018', 'Privacy Difference']  # order is important


class DifferenceCSVMappings(object):
    company = DIFFERENCE_COLUMN_NAMES[0]
    type = DIFFERENCE_COLUMN_NAMES[1]
    total_previous = DIFFERENCE_COLUMN_NAMES[2]
    total_next = DIFFERENCE_COLUMN_NAMES[3]
    total_difference = DIFFERENCE_COLUMN_NAMES[4]
    description = DIFFERENCE_COLUMN_NAMES[5]
    governance_previous = DIFFERENCE_COLUMN_NAMES[6]
    governance_next = DIFFERENCE_COLUMN_NAMES[7]
    governance_difference = DIFFERENCE_COLUMN_NAMES[8]
    freedom_of_expression_previous = DIFFERENCE_COLUMN_NAMES[9]
    freedom_of_expression_next = DIFFERENCE_COLUMN_NAMES[10]
    freedom_of_expression_difference = DIFFERENCE_COLUMN_NAMES[11]
    privacy_previous = DIFFERENCE_COLUMN_NAMES[12]
    privacy_next = DIFFERENCE_COLUMN_NAMES[13]
    privacy_difference = DIFFERENCE_COLUMN_NAMES[14]


class DifferenceJSONFields(object):
    name = "name"
    description = "description"
    total_2017 = "total_2017"
    total_2018 = "total_2018"
    total_difference = "total_difference"
    governance_2017 = "governance_2017"
    governance_2018 = "governance_2018"
    governance_difference = "governance_difference"
    freedom_of_expression_2017 = "freedom_of_expression_2017"
    freedom_of_expression_2018 = "freedom_of_expression_2018"
    freedom_of_expression_difference = "freedom_of_expression_difference"
    privacy_2017 = "privacy_2017"
    privacy_2018 = "privacy_2018"
    privacy_difference = "privacy_difference"
