import re
import csv
import os

_current_script_location = os.path.realpath(__file__)


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class UnrecognizedServiceName(Exception):
    pass


class ServiceIdReader(object, metaclass=Singleton):
    CSV_FILE_NAME = os.path.join(os.path.dirname(_current_script_location), 'service_ids.csv')
    SERVICE_COLUMN = 'Service'
    ID_COLUMN = 'Id'

    def __init__(self):
        self._parse_pattern = re.compile('\s+')
        self._ids_by_raw_service_names = {}
        self._ids_by_parsed_service_names = {}
        service_objects = []
        with open(self.CSV_FILE_NAME, 'r') as csv_file:
            reader = csv.DictReader(csv_file)
            service_objects.extend(list(reader))
        for service_obj in service_objects:
            self._ids_by_raw_service_names[service_obj[self.SERVICE_COLUMN]] = service_obj[self.ID_COLUMN]
            parsed_service_name = self._parse_service_name(service_obj[self.SERVICE_COLUMN])
            self._ids_by_parsed_service_names[parsed_service_name] = service_obj[self.ID_COLUMN]

    def _parse_service_name(self, name):
        return self._parse_pattern.sub('', name.lower())

    def get_id(self, service_name, secure_check=False):
        parsed_service_name = self._parse_service_name(service_name)
        if secure_check:
            result = self._ids_by_parsed_service_names.get(parsed_service_name, None)
            if result is None:
                raise UnrecognizedServiceName('Unrecognized service name %s please check %s for list of recognized'
                                              ' services. Extend it if it\'s needed' % (service_name, self.CSV_FILE_NAME))
            return result
        else:
            return self._ids_by_parsed_service_names[parsed_service_name]
