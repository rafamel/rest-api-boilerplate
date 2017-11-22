'use strict';
const { Joi, Flow, KeyFlow } = require('flowi');
const RequestValidation = rootRequire('./middlewares/request-validation');
const userSchema = require('../user/user.validation').schema;

module.exports = new RequestValidation({
    schema: KeyFlow({
        userId: Flow(Joi.number().integer().positive()).convert(),
        refreshToken: Joi.string()
    }),

    routes: (schema) => ({
        register: {
            body: KeyFlow(userSchema).require()
        },
        login: {
            body: KeyFlow(userSchema).use(['username', 'password']).require()
        },
        refresh: {
            body: KeyFlow(schema).require()
        }
    })
});
