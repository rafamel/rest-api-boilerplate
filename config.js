'use strict';
const path = require('path');
require('dotenv-safe').load({
    path: path.join(__dirname, 'config.env'),
    sample: path.join(__dirname, 'config.env.example')
});

module.exports = {
    port: process.env.PORT || 3000,
    logs: (process.env.NODE_ENV === 'production') ? 'combined' : 'dev',
    db: {
        url: process.env.DB_URL,
        max_connections: process.env.DB_MAX_CONNECTIONS || 2
    },
    auth: {
        jwtSecret: process.env.JWT_SECRET,
        jwtSaltWorkFactor: process.env.JWT_SALT_WORK_FACTOR || 8,
        jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
        jwtMaxAge: process.env.JWT_MAX_AGE || '30d'
    }
};
