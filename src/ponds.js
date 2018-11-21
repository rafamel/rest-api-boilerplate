import ponds, { PublicError, errors } from 'ponds';
import { Model } from 'objection';
import logger from 'logger';
import config from '~/config';

// Define ponds
ponds.set('default', {
  data(data, req, res) {
    res.send(data);
  },
  error(err, req, res) {
    res.status(err.status).send(`Error: ${err.message}. ${err.info || ''}`);
  }
});

ponds.set('api', {
  data(data, req, res) {
    res.json({
      status: 'success',
      data: data
    });
  },
  error(err, req, res) {
    const error = {
      id: err.id,
      message: err.message
    };
    if (err.info) error.info = err.info;
    res.status(err.status).json({
      status: 'error',
      error: error
    });
  }
});

// Errors transform
const { ValidationError, NotFoundError } = Model;
const production = config.get('env.production');
ponds.transform({
  error(err) {
    err = (() => {
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
        return new PublicError(errors.RequestValidation, {
          info: `${msg}: ${err.message}`,
          err: err
        });
      }

      // Objection Validation Error (database)
      if (err instanceof ValidationError) {
        const key = Object.keys(err.data)[0];
        err = err.data[key][0];
        // If unique, public & RequestValidation
        if (err.keyword === 'unique') {
          return new PublicError(errors.RequestValidation, {
            info: err.message,
            err: err
          });
        }
        // Non Public
        return new PublicError(errors.DatabaseValidation, {
          info: `['${key}'] ${err.message}`,
          err: err
        });
      }

      // Objection NotFound Error (database)
      if (err instanceof NotFoundError) {
        return new PublicError(errors.DatabaseNotFound, {
          info: err.message,
          err: err
        });
      }

      return new PublicError(undefined, { err: err });
    })();

    if (err.status === 500) logger.error(err.message, err.first.child);
    else logger.debug(err.message, !production && err.first.child);

    return err;
  }
});
