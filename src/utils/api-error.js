'use strict';

class ErrorType {
    constructor(name, status) {
        this.name = name;
        this.status = status;
    }
}

class APIError extends Error {
    constructor(message, { notice, status, type, err } = {}) {
        let trace, typeName;
        if (err instanceof APIError) {
            // Inherit first `APIError` properties (override following)
            message = err.message;
            notice = err.notice;
            status = err.status;
            typeName = err.type;
            trace = err.trace;
        } else {
            if (err instanceof Error) trace = err;
            if (type instanceof ErrorType) {
                if (!status || !Number.isInteger(status)) {
                    status = type.status;
                }
                typeName = type.name;
            }
        }

        if (!message) message = 'An error has occurred';
        super(message);
        this.notice = notice;
        this.status = (Number.isInteger(status)) ? status : 500;
        this.type = typeName || 'Error';
        this.trace = trace; // Might be undefined
    }
}

module.exports = {
    APIError,
    ErrorTypes: {
        NotFound: new ErrorType('NotFoundError', 404),
        Unauthorized: new ErrorType('UnauthorizedError', 401),
        RequestValidation: new ErrorType('RequestValidationError', 400),
        Database: new ErrorType('DatabaseError', 500),
        DatabaseValidation: new ErrorType('DatabaseValidationError', 500),
        DatabaseNotFound: new ErrorType('DatabaseNotFoundError', 400)
    }
};
