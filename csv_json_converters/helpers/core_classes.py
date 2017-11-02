class BaseChecker(object):
    INVALID_BASE_STRUCTURE_ERR_MSG = u'Invalid file structure it should have rows next first ' \
                                     u'columns (order must be same as presented here): {ordered_rows}.'
    FIELD_WHERE_IT_WENT_WRONG_ERR_MSG = u'It broke on field %s instead it got field with name %s.'
    ROW_NUMBER_ERR_MSG = u'Error happened on row %s.'
    COMPLEX_ERROR_MSG = u'{invalid_base_structure_err_msg}\n' + \
                        '\n'.join([FIELD_WHERE_IT_WENT_WRONG_ERR_MSG, ROW_NUMBER_ERR_MSG])
    MISSING_REQUIRED_COLUMN = u'Missing required column %s in input csv. \n' \
                              u'It should contain next columns: {all_columns}.'

    def check(self):
        pass
