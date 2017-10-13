'use strict';
const config = require('../../config');
const APIError = require('../utils/api-error.js');

module.exports = {
    notFound(req, res, next) {
        next(new APIError('Not Found', { status: 404 }));
    },

    handler(err, req, res, next) {
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
        res.status(err.status)
            .json({
                status: 'error',
                message: err.announce
            });
    }
};
