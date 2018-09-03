import Joi from 'joi';

class ErrorType {
  constructor(name, message, status) {
    // Validate input
    Joi.assert(name, Joi.string().label('name'));
    Joi.assert(message, Joi.string().label('message'));
    Joi.assert(
      status,
      Joi.number()
        .integer()
        .min(100)
        .max(599)
        .label('status')
    );

    this.name = name;
    this.message = message;
    this.status = status;
  }
}

const ErrorTypes = {
  Server: new ErrorType('ServerError', 'Server error', 500), // Default
  NotFound: new ErrorType('NotFoundError', 'Not found', 404),
  Unauthorized: new ErrorType(
    'UnauthorizedError',
    "You don't have access to this resource",
    401
  ),
  RequestValidation: new ErrorType(
    'RequestValidationError',
    'Invalid request',
    400
  ),
  Database: new ErrorType('DatabaseError', 'Database error', 500),
  DatabaseValidation: new ErrorType(
    'DatabaseValidationError',
    'Invalid database request',
    500
  ),
  DatabaseNotFound: new ErrorType(
    'DatabaseNotFoundError',
    'Item not found in database',
    500
  )
};

class PublicError extends Error {
  constructor(type, { info, err } = {}) {
    let message, status, typeName, trace;
    if (err instanceof PublicError) {
      // Inherit first `PublicError` properties (override following)
      message = err.message;
      info = err.info;
      status = err.status;
      typeName = err.type;
      trace = err.trace;
    } else {
      if (err instanceof Error) trace = err;
      if (!(type instanceof ErrorType)) {
        type = ErrorTypes.Server;
      }
      message = type.message;
      status = type.status;
      typeName = type.name;
    }

    super(message);
    this.info = info;
    this.status = status;
    this.type = typeName;
    this.trace = trace; // Might be undefined
  }
}

export { PublicError as default, ErrorType, ErrorTypes };
