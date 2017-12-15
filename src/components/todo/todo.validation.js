'use strict';
const Joi = require('joi-add')();
const { RequestValidation, ValidationSchema } = require('request-validation');

const schema = new ValidationSchema({
    body: {
        name: Joi.string()
            .min(1).max(255)
            .addLabel('Todo name'),
        done: Joi.boolean()
            .options({ convert: true })
    }
});

module.exports = new RequestValidation({
    create: schema.presence('required'),
    update: schema.presence('required'),
    patch: schema
});
