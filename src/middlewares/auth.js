'use strict';
const PublicError = require('../utils/public-error.js');
const passport = require('passport');

module.exports = function (req, res, next) {
    passport.authenticate('jwt', function (err, user) {
        if (err) return next(new PublicError('Error recovering user data.', { err: err }));
        if (!user) {
            return next(new PublicError(
                'You don\'t have access to this resource.',
                { status: 401, err: err }
            ));
        }
        req.user = user;
        next();
    })(req, res, next);
};
