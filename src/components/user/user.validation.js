'use strict';
const Joi = require('joi');
const { flow:Flow, keyFlow:KeyFlow } = require('../../utils/flowi');
const PublicError = require('../../utils/public-error');
const User = require('./user.model');

const validations = {
    schema: KeyFlow({
        username: Flow().label('Username')
            .and(Joi.string().min(6).max(16), 'Username should have a length of 6 to 16 characters.')
            .and(Joi.string().regex(/^[a-zA-Z0-9_]+$/), 'Username should only contain letters, numbers, and underscores (_).'),
        password: Flow().label('Password')
            .and(Joi.string().min(8).max(20), 'Password should have a length of 6 to 16 characters.')
            .and(Joi.string().regex(/^[a-zA-Z0-9_]+$/), 'Password should only contain letters, numbers, and underscores (_).')
            .and(Joi.string().regex(/[a-zA-Z]/), 'Password should contain some letters.'),
        email: Joi.string().label('Email').email()
    })
}

module.exports = {

    index: { },
    show: { body:
        KeyFlow()
        .require({
            username: 'Username',
            password: 'Password',
        })
    },
    create: { body:
        validations.schema
        .require({
            username: 'Username',
            password: 'Password',
            email: 'Email'
        })
    }

};
