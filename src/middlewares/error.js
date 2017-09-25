'use strict';
const Thrower = require('../utils/thrower.js');

module.exports = {
    notFound(req, res, next) {
        next(new Thrower('Not Found', { status: 404 }));
    },

    handler(err, req, res, next) {
        if (!(err instanceof Thrower)) err = new Thrower(null, { err: err });
        if (err.message !== err.announce) console.error(err);
        res.status(err.status)
            .json({
                status: 'error',
                message: err.announce
            });
    }
};
