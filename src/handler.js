import PublicError, { ErrorTypes } from '@/utils/public-error';
import { Model } from 'objection';
import config from '@/config';

const { ValidationError, NotFoundError } = Model;
const schemes = {
  default: {
    data(req, res, data) {
      res.send(data);
    },
    error(req, res, err) {
      res.status(err.status).send(err.message);
    }
  },
  api: {
    data(req, res, data) {
      res.json({
        status: 'success',
        data: data
      });
    },
    error(req, res, err) {
      const error = {
        message: err.message,
        type: err.type
      };
      if (err.notice) error.notice = err.notice;
      res.status(err.status).json({
        status: 'error',
        error: error
      });
    }
  }
};

function errorHandler(err) {
  try {
    // PublicError
    if (err instanceof PublicError) {
      return err;
    }

    // Joi
    if (err.isRequestValidation && err.isJoi) {
      const details = err.details[0];
      const msg =
        details.context.isExplicit || details.context.addLabel
          ? details.message
          : 'Bad Request';
      return new PublicError(msg, {
        notice: err.message,
        type: ErrorTypes.RequestValidation,
        err: err
      });
    }

    // Objection Validation Error (database)
    if (err instanceof ValidationError) {
      const key = Object.keys(err.data)[0];
      err = err.data[key][0];
      // If unique, public & RequestValidation
      if (err.keyword === 'unique') {
        return new PublicError(err.message, {
          type: ErrorTypes.RequestValidation,
          err: err
        });
      }
      // Non Public
      return new PublicError('Unexpected database validation error', {
        notice: `['${key}'] ${err.message}`,
        type: ErrorTypes.DatabaseValidation,
        err: err
      });
    }

    // Objection NotFound Error (database)
    if (err instanceof NotFoundError) {
      return new PublicError(`Item not found`, {
        notice: err.message,
        type: ErrorTypes.DatabaseNotFound,
        err: err
      });
    }

    return new PublicError(null, { err: err });
  } catch (e) {
    return new PublicError(null, { err: e });
  }
}

function handler(appOrRouter, scheme) {
  return (...args) => {
    appOrRouter.use(
      ...args,
      (req, res, next) => {
        // 404 Error
        next(new PublicError('Not Found', { type: ErrorTypes.NotFound }));
      },
      (data, req, res, next) => {
        // Data delivery
        if (!(data instanceof Error) && data !== undefined) {
          return scheme.data(req, res, data);
        }
        // Error handler
        const err = errorHandler(data);
        // eslint-disable-next-line
        if (!config.production && err.trace) console.error(err);
        scheme.error(req, res, err);
      }
    );
  };
}

export default (appOrRouter) => {
  const handlers = {};
  Object.keys(schemes).forEach((key) => {
    handlers[key] = handler(appOrRouter, schemes[key]);
  });
  return handlers;
};
