'use strict';
const path = require('path');
const randtoken = require('rand-token');
const Joi = require('joi');

const config = () => ({
    production: env === 'production',
    port: process.env.PORT || forEnv({
        default: 3000,
        production: 80
    }),
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
            development: '15d',
            test: '5s'
        }),
        refreshToken: forEnv({
            default: { expiry: '45d', renewRemaining: '15d' },
            test: { expity: '10s', renewRemaining: '5s' }
        })
    }
});

// Load environment variables from file
require('dotenv-safe').load({
    path: path.join(__dirname, '../config.env'),
    sample: path.join(__dirname, '../config.env.example')
});

// Validating NODE_ENV as one of
// 'production', 'development', 'test'
const env = Joi.attempt(
    process.env.NODE_ENV,
    Joi.string()
        .default('development')
        .valid(['production', 'development', 'test'])
        .label('NODE_ENV')
);

// Helper - Get the right config value for current env
function forEnv(obj) {
    // Validate input as object with required 'default'
    // key and optional 'production', 'development', and 'test' keys
    Joi.assert(
        obj,
        Joi.object().keys({
            default: Joi.any(),
            production: Joi.any(),
            development: Joi.any(),
            test: Joi.any()
        }).requiredKeys(['default'])
    );
    // Get and return config value
    return obj.hasOwnProperty(env) ? obj[env] : obj.default;
}

module.exports = config();
