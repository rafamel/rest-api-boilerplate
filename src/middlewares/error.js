'use strict';
const PublicError = require('../utils/public-error.js');

module.exports = {
    notFound(req, res, next) {
        next(new PublicError('Not Found', { status: 404 }));
    },

    handler(err, req, res, next) {
        if (err.isFlowi) {
            if (err.isExplicit || err.label) {
                err = new PublicError(err.message, { status: 400 });
            } else err = new PublicError('Bad Request', { status: 400 });
        } else if (!(err instanceof PublicError)) {
            err = new PublicError(null, { err: err });
        }
        if (err.trace) console.error(err);
        res.status(err.status)
            .json({
                status: 'error',
                message: err.announce
            });
    }
};
