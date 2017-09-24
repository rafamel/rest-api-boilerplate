'use strict';
const fs = require('fs');
const path = require('path');
const db = require('./db_connect');

const buildScript = String(fs.readFileSync(path.join(__dirname, 'db_build.sql')));
db.q.result(buildScript)
    .then(console.log)
    .catch(e => {
        console.log('Error');
        throw e;
    });
