'use strict';
const path = require('path');
const randtoken = require('rand-token');
const Joi = require('joi');
require('dotenv-safe').load({
    path: path.join(__dirname, '../config.env'),
    sample: path.join(__dirname, '../config.env.example')
});

const env = process.env.NODE_ENV || 'development';
function forEnv(obj) {
    Joi.assert(
        obj,
        Joi.object().keys({
            default: Joi.any(),
            production: Joi.any(),
            development: Joi.any(),
            test: Joi.any()
        }).requiredKeys(['default'])
    );
    return obj.hasOwnProperty(env) ? obj[env] : obj.default;
}

module.exports = {
    production: env === 'production',
    port: process.env.PORT || 3000,
    logs: forEnv({
        default: 'dev',
        production: 'combined'
    }),
    db: {
        client: 'pg',
        connection: forEnv({
            default: process.env.DB_URL,
            test: process.env.DB_TEST_URL
        }),
        pool: { min: 2, max: 10 }
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || randtoken.generate(40),
        jwtSaltWorkFactor: process.env.JWT_SALT_WORK_FACTOR || forEnv({
            default: 12,
            development: 1
        }),
        jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
        jwtAuthExpiry: forEnv({
            default: '15m',
            development: '15d'
        }),
        refreshToken: {
            expiry: '45d',
            renewRemaining: '15d'
        }
    }
};
