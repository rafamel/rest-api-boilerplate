'use strict';
const { Joi, Flow, KeyFlow } = require('flowi');
const RequestValidation = rootRequire('./middlewares/request-validation');

module.exports = new RequestValidation({
    schema: KeyFlow({
        username: Flow()
            .and(Joi.string().min(6).max(16), 'Username should have a length of 6 to 16 characters.')
            .and(Joi.string().regex(/^[a-zA-Z0-9_]+$/), 'Username should only contain letters, numbers, and underscores (_).'),
        password: Flow()
            .and(Joi.string().min(8).max(20), 'Password should have a length of 8 to 20 characters.')
            .and(Joi.string().regex(/^[a-zA-Z0-9_]+$/), 'Password should only contain letters, numbers, and underscores (_).')
            .and(Joi.string().regex(/[a-zA-Z]/), 'Password should contain some letters.'),
        email: Joi.string().email()
    }).labels({
        username: 'Username',
        email: 'Email',
        password: 'Password'
    }),

    routes: (schema) => ({
        patch: {
            body: KeyFlow(schema).require(true, 1)
        }
    })
});
