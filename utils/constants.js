/**
 * Created by vik on 01/11/16.
 */
const ERROR_MESSAGES = {
    'INVALID_USER' : 'invalid user',
    'BAD_AUTH_FORMAT' : 'Bad HTTP authentication header format',
    'INVALID_TOKEN' : 'invalid access token',
    'MISSING_AUTHORIZATION' : 'Missing authorization',
    'DEFAULT_MESSAGE' : 'Something went wrong',
    'DUPLICATE_VALUE' : 'The {key} already exists in our records',
    'INVALID_PASSWORD' : 'Invalid Password'
};

const SUCCESS_MESSAGES = {
    'DEFAULT_MESSAGE' : 'Action Complete'
};

const STATUS_CODES = {
    'VALIDATION_ERROR' : 400,
    'DEFAULT_ERROR' : 500,
    'DEFAULT_SUCCESS' : 200,
    'BAD_REQUEST' : 400
}

const EVENT_TYPES = {
    'SOCKET_CONNECTED' : 'connection',
    'PING' : 'ping',
    'FIELDS_UPDATED' : 'fieldUpdated',
    'DISCONNECT' : 'disconnect'
};

const ALLOWED_FIELDS = [
    'firstName','lastName','favColor', 'favPlace'
];

module.exports = {
    ERROR_MESSAGES,
    EVENT_TYPES,
    ALLOWED_FIELDS,
    SUCCESS_MESSAGES,
    STATUS_CODES
};