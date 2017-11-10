'use strict';
const APIError = rootRequire('utils/api-error');
const { batchDispatch } = rootRequire('middlewares/dispatch');
const User = require('./user.model');

// Naming: index, show, create, update, destroy

module.exports = batchDispatch({
    async show(req) {
        if (req.user.id !== Number(req.params.id)) {
            throw new APIError(`You don't have access to this resource`, { status: 401 });
        }
        return req.user;
    },
    async create(req) {
        const user = await User.method.create(req.body);
        return user;
    }
});
