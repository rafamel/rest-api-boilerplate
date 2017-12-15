'use strict';
const { APIError, ErrorTypes } = rootRequire('utils/api-error');
const { batchDispatch } = rootRequire('middlewares/dispatch');
const Auth = require('./auth.model');
const User = require('./user.model');

// index, show, create, update, patch, delete
module.exports = batchDispatch({
    async login(req) {
        const user = await User.query()
            .first()
            .where('username', req.body.username);

        if (!user || !(await user.isPassword(req.body.password))) {
            throw new APIError('Invalid username or password.',
                { type: ErrorTypes.Unauthorized });
        }

        const refreshToken = await Auth.method.create(user);
        return {
            user: user,
            token: await refreshToken.newAccessToken(user)
        };
    },

    async register(req) {
        const user = await User.query()
            .insert(req.body)
            .returning('*');
        const refreshToken = await Auth.method.create(user);
        return {
            user: user,
            token: await refreshToken.newAccessToken(user)
        };
    },

    async refresh(req) {
        const user = await User.query()
            .findById(req.body.userId)
            .notNone();
        const refreshToken = await Auth.method.get(req.body.refreshToken);
        return refreshToken.newAccessToken(user);
    },

    async show(req) {
        return User.query()
            .findById(req.params.id)
            .notNone();
    },

    async patch(req) {
        return User.query()
            .findById(req.params.id)
            .notNone()
            .then(m => m.$query()
                .patch(req.body)
                .returning('*')
            );
    },
    async delete(req) {
        return User.query()
            .findById(req.params.id)
            .notNone()
            .then(m => m.$query()
                .delete().runAfter(x => x === 1)
            );
    }
});
