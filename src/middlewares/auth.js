'use strict';
const APIError = require('../utils/api-error.js');
const passport = require('passport');

module.exports = {
    authorize: function authorize(req, res, next) {
        passport.authenticate('jwt', { session: false }, function (err, user, info) {
            if (err) {
                return next(new APIError('Error retrieving user data.', { err: err }));
            }
            if (!user) {
                return next(new APIError(
                    'You don\'t have access to this resource.',
                    { status: 401, err: info }
                ));
            }
            req.user = user;
            next();
        })(req, res, next);
    }
};
