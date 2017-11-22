'use strict';
const { env, onEnv } = require('./utils/config-utils');
const randtoken = require('rand-token');

module.exports = {
    production: env === 'production',
    port: process.env.PORT || onEnv({
        default: 3000,
        production: 80
    }),
    logs: onEnv({
        default: 'dev',
        production: 'combined'
    }),
    parse: { json: false, urlencoded: true },
    db: {
        client: 'pg',
        connection: onEnv({
            default: process.env.DB_URL,
            test: process.env.DB_TEST_URL
        }),
        pool: { min: 2, max: 10 }
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || randtoken.generate(40),
        jwtSaltWorkFactor: process.env.JWT_SALT_WORK_FACTOR || onEnv({
            default: 12,
            development: 1
        }),
        jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
        jwtAuthExpiry: onEnv({
            default: '15m',
            development: '15d',
            test: '5s'
        }),
        refreshToken: onEnv({
            default: { expiry: '45d', renewRemaining: '15d' },
            test: { expity: '10s', renewRemaining: '5s' }
        })
    }
};
