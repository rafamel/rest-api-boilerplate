'use strict';
const path = require('path');
const randtoken = require('rand-token');
require('dotenv-safe').load({
    path: path.join(__dirname, '../config.env'),
    sample: path.join(__dirname, '../config.env.example')
});

module.exports = {
    production: process.env.NODE_ENV === 'production',
    port: process.env.PORT || 3000,
    logs: (process.env.NODE_ENV === 'production') ? 'combined' : 'dev',
    db: {
        url: process.env.DB_URL,
        pool: {
            min: 2,
            max: 10
        }
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET || randtoken.generate(40),
        jwtSaltWorkFactor: process.env.JWT_SALT_WORK_FACTOR || 10,
        jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
        jwtAuthExpiry: '15m',
        refreshToken: {
            expiry: '45d',
            renewRemaining: '15d'
        }
    }
};
