'use strict';
const APIError = require('./utils/api-error');
const Delivery = require('./utils/delivery');
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
                if (err instanceof Delivery) {
                    return scheme.data(req, res, err);
                }
                if (err.isFlowi) {
                    if (err.isExplicit || err.label) {
                        err = new APIError(err.message, { status: 400 });
                    } else {
                        if (!config.production) console.error(err);
                        err = new APIError('Bad Request', { status: 400 });
                    }
                } else if (!(err instanceof APIError)) {
                    err = new APIError(null, { err: err });
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
