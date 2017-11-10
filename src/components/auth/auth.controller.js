'use strict';
const APIError = rootRequire('utils/api-error');
const { batchDispatch } = rootRequire('middlewares/dispatch');
const Auth = require('./auth.model');
const User = require('../user/user.model');

// Naming: index, show, create, update, destroy

module.exports = batchDispatch({
    async login(req) {
        const user = await User.query().first().where('username', req.body.username);
        if (!user
            || !(await user.isPassword(req.body.password))) {
            throw new APIError('Invalid username or password.', { status: 401 });
        }
        const refreshToken = await Auth.method.create(user);
        return {
            user: user,
            token: await refreshToken.newAccessToken(user)
        };
    },

    async register(req) {
        const user = await User.method.create(req.body);
        const refreshToken = await Auth.method.create(user);
        return {
            user: user,
            token: await refreshToken.newAccessToken(user)
        };
    },

    async refresh(req) {
        const user = await User.query().findById(req.body.userId);
        const refreshToken = await Auth.method.get(req.body.refreshToken);
        return refreshToken.newAccessToken(user);
    }
});
