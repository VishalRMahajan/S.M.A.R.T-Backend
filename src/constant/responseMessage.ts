export default {
    SUCCESS: 'The request has succeeded',
    RUNNING: 'API is running',
    NOT_FOUND: (enitiy: string) => `${enitiy} not found, please check the request and try again`,
    BAD_REQUEST: 'The server could not understand the request due to invalid syntax',
    UNAUTHORIZED: 'The client must authenticate itself to get the requested response',
    FORBIDDEN: 'The client does not have access rights to the content',
    SOMETHING_WENT_WRONG: 'Something went wrong, please try again later or contact the administrator',
    TOO_MANY_REQUESTS: 'Too many requests, please try again later'
}
