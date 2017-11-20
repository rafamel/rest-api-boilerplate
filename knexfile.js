'use strict';
const config = require('./src/config');

module.exports = {
    client: config.db.client,
    connection: config.db.connection,
    pool: config.db.pool,
    migrations: {
        directory: './src/db/migrations'
    }
};
