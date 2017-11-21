'use strict';
const { APIError, ErrorTypes } = rootRequire('utils/api-error');
const passport = require('passport');
const User = rootRequire('components/user/user.model');

module.exports = {
    role: {
        user: 0,
        editor: 1,
        admin: 2
    },
    authorize(role = 0) {
        return async (req, res, next) => {
            passport.authenticate('jwt', { session: false }, async (err, user, info) => {
                if (err) {
                    return next(
                        new APIError('Error retrieving user data.', { err: err })
                    );
                }
                const noAccess = () => new APIError(
                    'You don\'t have access to this resource.',
                    { type: ErrorTypes.Unauthorized, err: info }
                );
                if (!user) {
                    return (info && info.name === 'TokenExpiredError')
                        ? next(new APIError(
                            'Access Token has expired.',
                            { type: ErrorTypes.Unauthorized, err: info }
                        ))
                        : next(noAccess());
                }
                if (
                    role > 0
                    && (await User.query().findById(user.id)).role !== role
                ) {
                    return next(noAccess());
                }

                req.user = user;
                next();
            })(req, res, next);
        };
    }
};
