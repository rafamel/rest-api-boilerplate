const Joi = require('~/utils/joi');
const config = require('~/config');

class ErrorType {
  constructor(name, status) {
    // Validate input
    Joi.assert(name, Joi.string().label('name'), config.joi);
    Joi.assert(
      status,
      Joi.number()
        .integer()
        .min(100)
        .max(599)
        .label('status'),
      config.joi
    );

    this.name = name;
    this.status = status;
  }
}

const ErrorTypes = {
  Server: new ErrorType('ServerError', 500), // Default
  NotFound: new ErrorType('NotFoundError', 404),
  Unauthorized: new ErrorType('UnauthorizedError', 401),
  RequestValidation: new ErrorType('RequestValidationError', 400),
  Database: new ErrorType('DatabaseError', 500),
  DatabaseValidation: new ErrorType('DatabaseValidationError', 500),
  DatabaseNotFound: new ErrorType('DatabaseNotFoundError', 400)
};

class PublicError extends Error {
  constructor(message, { notice, status, type, err } = {}) {
    let trace, typeName;
    if (err instanceof PublicError) {
      // Inherit first `PublicError` properties (override following)
      message = err.message;
      notice = err.notice;
      status = err.status;
      typeName = err.type;
      trace = err.trace;
    } else {
      if (err instanceof Error) trace = err;
      if (!(type instanceof ErrorType)) {
        type = ErrorTypes.Server;
      }
      if (!status || !Number.isInteger(status)) {
        status = type.status;
      }
      typeName = type.name;
    }

    if (!message) message = 'An error has occurred';
    super(message);
    this.notice = notice;
    this.status = status;
    this.type = typeName;
    this.trace = trace; // Might be undefined
  }
}

module.exports = {
  PublicError,
  ErrorTypes
};
