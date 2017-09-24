'use strict';
const url = require('url');
const pgp = require('pg-promise')();
const config = require('../../config');

if (!config.db.url) throw new Error('Enviroment variable DB_URL must be set');

const params = url.parse(config.db.url);
const [username, password] = params.auth.split(':');

const db = pgp({
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    user: username,
    password: password,
    max: config.db.max_connections,
    ssl: params.hostname !== 'localhost'
});

function toColumnsAndValues(obj) {
    const keys = Object.keys(obj);
    return {
        columns: keys.join(', '),
        values: keys.map(x => `'${ obj[x] }'`).join(', ')
    };
}

module.exports = {
    q: db,
    prep: toColumnsAndValues
};
