'use strict';
const { batchDispatch } = rootRequire('middlewares/dispatch');
const Todo = require('./todo.model');

// Naming: index, show, create, update, destroy

module.exports = batchDispatch({
    async index(req) {
        return Todo.query()
            .where('user_id', req.user.id);
    },
    async show(req) {
        return Todo.query()
            .findById(req.params.id)
            .notNone()
            .then(m => m
                .assertOwner(req.user)
            );
    },
    async create(req) {
        req.body.user_id = req.user.id;
        return Todo.query()
            .insert(req.body);
    },
    async update(req) {
        req.body.user_id = req.user.id;
        return Todo.query()
            .findById(req.params.id)
            .notNone()
            .then(m => m
                .assertOwner(req.user)
                .$query().updateAndFetch(req.body)
            );
    },
    async patch(req) {
        return Todo.query()
            .findById(req.params.id)
            .notNone()
            .then(m => m
                .assertOwner(req.user)
                .$query().patchAndFetch(req.body)
            );
    },
    async delete(req) {
        return Todo.query()
            .findById(req.params.id)
            .notNone()
            .then(m => m
                .assertOwner(req.user)
                .$query().delete().runAfter(x => x === 1)
            );
    }
});
