'use strict';
const { APIError, ErrorTypes } = require('./utils/api-error');
const Delivery = require('./utils/delivery');
const { ValidationError, NotFoundError } = require('objection').Model;
const config = require('./config');

const schemes = {
    default: {
        data(req, res, delivery) {
            res.send(delivery.data);
        },
        error(req, res, error) {
            res.status(error.status)
                .send(error.message);
        }
    },
    api: {
        data(req, res, delivery) {
            res.json({
                status: 'success',
                data: delivery.data
            });
        },
        error(req, res, error) {
            const ans = {
                status: 'error',
                message: error.message,
                type: error.type
            };
            if (error.notice) ans.notice = error.notice;
            res.status(error.status)
                .json(ans);
        }
    }
};

function errorHandler(err) {
    // Flowi Errors (request validation)
    if (err.isFlowi) {
        const msg = (err.isExplicit || err.label)
            ? err.message
            : 'Bad Request';
        return new APIError(msg, {
            notice: err.note,
            type: ErrorTypes.RequestValidation,
            err: err
        });
    }

    // Objection Validation Error (database)
    if (err instanceof ValidationError) {
        const key = Object.keys(err.data)[0];
        err = err.data[key][0];
        // If unique, public
        if (err.keyword === 'unique') {
            return new APIError(err.message,
                { type: ErrorTypes.DatabaseValidation, err: err });
        }
        // Non Public
        return new APIError('Unexpected database validation error', {
            notice: `'${key}' ${err.message}`,
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
            (err, req, res, next) => {
                // Data delivery and error handler
                // eslint-disable-next-line
                if (err instanceof Delivery && err.data != undefined) {
                    return scheme.data(req, res, err);
                }
                if (!(err instanceof APIError)) {
                    try {
                        err = errorHandler(err);
                    } catch (error) {
                        err = new APIError(null, { err: error });
                    }
                }
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
