'use strict';
const { batchDispatch } = rootRequire('middlewares/dispatch');
const User = require('./user.model');

module.exports = batchDispatch({
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
