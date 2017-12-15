'use strict';
const { APIError, ErrorTypes } = require('./utils/api-error');
const { ValidationError, NotFoundError } = require('objection').Model;
const config = require('./config');

const schemes = {
    default: {
        data(req, res, data) {
            res.send(data);
        },
        error(req, res, err) {
            res.status(err.status)
                .send(err.message);
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
            res.status(err.status)
                .json({
                    status: 'error',
                    error: error
                });
        }
    }
};

function errorHandler(err) {
    try {
        // APIError
        if (err instanceof APIError) {
            return err;
        }

        // Joi
        if (err.isRequestValidation && err.isJoi) {
            const details = err.details[0];
            const msg = (details.context.isExplicit || details.context.addLabel)
                ? details.message
                : 'Bad Request';
            return new APIError(msg, {
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
                return new APIError(err.message,
                    { type: ErrorTypes.RequestValidation, err: err });
            }
            // Non Public
            return new APIError('Unexpected database validation error', {
                notice: `['${key}'] ${err.message}`,
                type: ErrorTypes.DatabaseValidation,
                err: err
            });
        }

        // Objection NotFound Error (database)
        if (err instanceof NotFoundError) {
            return new APIError(`Item not found`, {
                notice: err.message,
                type: ErrorTypes.DatabaseNotFound,
                err: err
            });
        }

        return new APIError(null, { err: err });

    // Catch if error
    } catch (e) {
        return new APIError(null, { err: e });
    }
}

function handler(appOrRouter, scheme) {
    return (...args) => {
        appOrRouter.use(
            ...args,
            (req, res, next) => {
                // 404 Error
                next(new APIError('Not Found', {
                    type: ErrorTypes.NotFound
                }));
            },
            (data, req, res, next) => {
                // Data delivery
                if (!(data instanceof Error) && data !== undefined) {
                    return scheme.data(req, res, data);
                }
                // Error handler
                const err = errorHandler(data);
                if (!config.production && err.trace) console.error(err);
                scheme.error(req, res, err);
            }
        );
    };
}

module.exports = (appOrRouter) => {
    const handlers = {};
    Object.keys(schemes).forEach(key => {
        handlers[key] = handler(appOrRouter, schemes[key]);
    });
    return handlers;
};
