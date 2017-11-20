'use strict';
const APIError = require('./utils/api-error');
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
                .send(error.announce);
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
            res.status(error.status)
                .json({
                    status: 'error',
                    message: error.announce
                });
        }
    }
};

function handler(appOrRouter, scheme) {
    return (...args) => {
        appOrRouter.use(
            ...args,
            (req, res, next) => {
                // 404 Error
                next(new APIError('Not Found', { status: 404 }));
            },
            (err, req, res, next) => {
                // Data delivery and error handler
                // eslint-disable-next-line
                if (err instanceof Delivery && err.data != undefined) {
                    return scheme.data(req, res, err);
                }
                if (!(err instanceof APIError)) {
                    if (err.isFlowi) {
                        if (err.isExplicit || err.label) {
                            err = new APIError(err.message, { status: 400 });
                        } else {
                            if (!config.production) console.error(err);
                            err = new APIError('Bad Request', { status: 400 });
                        }
                    } else if (err instanceof ValidationError) {
                        const key = Object.keys(err.data)[0];
                        err = err.data[key][0];
                        if (err.keyword === 'unique') {
                            // Public
                            err = new APIError(err.message, { status: 400 });
                        } else {
                            // Non Public
                            err = new APIError(err.message, { status: 500 });
                        }
                    } else if (err instanceof NotFoundError) {
                        err = new APIError(`Item not found`, {
                            status: 400,
                            err: err
                        });
                    } else {
                        err = new APIError(null, { err: err });
                    }
                }
                if (err.trace) console.error(err);
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
