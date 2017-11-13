'use strict';
const { batchDispatch } = rootRequire('middlewares/dispatch');
const assertNotNil = rootRequire('utils/assert-not-nil');
const Todo = require('./todo.model');

// Naming: index, show, create, update, destroy

module.exports = batchDispatch({
    async index(req) {
        return Todo.query().where('user_id', req.user.id);
    },
    async show(req) {
        return assertNotNil(await Todo.query().findById(req.params.id))
            .assertOwner(req.user);
    },
    async create(req) {
        return Todo.query().insert(
            Object.assign({}, req.body, { user_id: req.user.id })
        );
    },
    async update(req) {
        return assertNotNil(await Todo.query().findById(req.params.id))
            .assertOwner(req.user)
            .$query().updateAndFetch(
                Object.assign({}, req.body, { user_id: req.user.id })
            );
    },
    async patch(req) {
        return assertNotNil(await Todo.query().findById(req.params.id))
            .assertOwner(req.user)
            .$query().patchAndFetch(req.body);
    },
    async delete(req) {
        const query = await assertNotNil(
            await Todo.query().findById(req.params.id)
        ).assertOwner(req.user).$query().delete();
        return query === 1;
    }
});
