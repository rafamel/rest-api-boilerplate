const config = require('./src/config');

module.exports = {

    development: {
        client: 'pg',
        connection: config.db.url,
        pool: config.db.pool,
        migrations: {
            directory: './src/db/migrations'
        }
    },

    staging: {
        client: 'pg',
        connection: config.db.url,
        pool: config.db.pool,
        migrations: {
            directory: './src/db/migrations'
        }
    },

    production: {
        client: 'pg',
        connection: config.db.url,
        pool: config.db.pool,
        migrations: {
            directory: './src/db/migrations'
        }
    }

};
