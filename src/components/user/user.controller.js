'use strict';
const { batchDispatch } = rootRequire('middlewares/dispatch');
const assertNotNil = rootRequire('utils/assert-not-nil');
const User = require('./user.model');

module.exports = batchDispatch({
    async show(req) {
        return assertNotNil(
            await User.query().findById(req.params.id)
        );
    },
    async patch(req) {
        return assertNotNil(
            await User.query().findById(req.params.id)
        ).$query().patchAndFetch(req.body);
    },
    async delete(req) {
        const query = await assertNotNil(
            await User.query().findById(req.params.id)
        ).$query().delete();
        return query === 1;
    }
});
