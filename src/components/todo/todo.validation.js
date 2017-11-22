'use strict';
const { Joi, Flow, KeyFlow } = require('flowi');
const RequestValidation = rootRequire('./middlewares/request-validation');

module.exports = new RequestValidation({
    schema: KeyFlow({
        name: Joi.string().min(1).max(255),
        done: Flow(Joi.boolean()).convert()
    }).labels({ name: 'Todo name' }),

    routes: (schema) => ({
        createUpdate: {
            body: KeyFlow(schema).require(['name'])
        },
        patch: {
            body: KeyFlow(schema)
                .require(true, 1)
        }
    })
});
