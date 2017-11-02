# coding=utf-8
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
    u'G1.', u'G2.', u'G3.', u'G4.', u'G5.', u'G6.', u'F1.', u'F2.', u'F3.', u'F4.', u'F5.', u'F6.', u'F7.', u'F8.',
    u'F9.', u'F10.', u'F11.', u'P1.', u'P2.', u'P3.', u'P4.', u'P5.', u'P6.', u'P7.', u'P8.', u'P9.', u'P10.', u'P11.',
    u'P12.', u'P13.', u'P14.', u'P15.', u'P16.', u'P17.', u'P18.']

COMPANIES_COLUMNS = [
    'América Móvil', 'Apple', 'AT&T', 'Axiata', 'Baidu', 'Bharti Airtel', 'Etisalat', 'Facebook', 'Google', 'Kakao',
    'Mail.Ru', 'Microsoft', 'MTN', 'Ooredoo', 'Orange', 'Samsung', 'Telefónica', 'Tencent', 'Twitter', 'Vodafone',
    'Yahoo', 'Yandex'
]  # order is not important


class IndicatorOverviewJsonFields(object):
    id = 'id'
    name = 'name'
    scores = 'scores'
