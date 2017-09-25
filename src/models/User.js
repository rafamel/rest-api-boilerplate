'use strict';
const db = require('../database/db_connect');
const modeler = require('../utils/modeler');
const config = require('../../config');
const Thrower = require('../utils/thrower.js');

const { promisify } = require('util');
const bcrypt = require('bcrypt-nodejs');
const genSaltAsync = promisify(bcrypt.genSalt);
const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

class User {
    constructor() {
        this.validate = modeler.schema({
            username: {
                required: [true, 'Username is required'],
                tests: [{
                    test: (x, _) => modeler.validator.isLength(x, {min: 6, max: 16}),
                    message: 'Username should have a length of 6 to 16 characters.'
                }, {
                    test: (x, _) => !(x.match(/[^a-zA-Z0-9_]/)),
                    message: 'Username should only contain letters (lower or uppercase), numbers, and underscores (_).'
                }, {
                    test: async (x, _) => !(await this.exists('username', x)),
                    message: 'Username already exists.'
                }]
            },
            password: {
                required: [true, 'Password is required'],
                tests: [{
                    test: (x, _) => modeler.validator.isLength(x, {min: 8, max: 20}),
                    message: 'Password should have a length of 8 to 20 characters.'
                }, {
                    test: (x, _) => !(x.match(/[^a-zA-Z0-9_]/)),
                    message: 'Password should only contain letters (lower or uppercase), numbers, and underscores (_).'
                }, {
                    test: (x, _) => x.match(/[^0-9_]/),
                    message: 'Password shouldn\'t consist of just numbers.'
                }]
            },
            email: {
                required: [true, 'Email is required'],
                tests: [{
                    test: (x, _) => modeler.validator.isEmail(x),
                    message: 'Email should be valid.'
                }, {
                    test: async (x, _) => !(await this.exists('email', x)),
                    message: 'Email already exists.'
                }]
            },
            role: {
                tests: [{
                    test: (x, _) => x === 'user',
                    message: 'Non valid user role.'
                }]
            }
        });
    }

    // Public
    async create(creationObj) {
        // Validation checks
        creationObj = this.validate.clean(creationObj);
        const validation = await this.validate.all(creationObj);
        if (validation) throw new Thrower(validation, { status: 401 });

        // Hash password
        creationObj.hash = await hashAsync(
            creationObj.password,
            await genSaltAsync(config.auth.jwtSaltWorkFactor),
            null
        );
        delete creationObj.password;

        // Insert values
        // eslint-disable-next-line
        await db.q.query('INSERT INTO users(${columns^}) VALUES (${values^});', db.prep(creationObj));

        try {
            return await this.getOneBy('username', creationObj.username);
        } catch (err) {
            throw new Thrower('User was registered but there was an error retrieving the user data', { err: err });
        }
    }

    async get(id) {
        return db.q.one(`SELECT * FROM users WHERE id='${id}';`);
    }

    async getAll() {
        return db.q.query(`SELECT * FROM users;`);
    }

    // Private
    async getOneBy(field, value) {
        return db.q.one(`SELECT * FROM users WHERE ${field}='${value}' LIMIT 1;`);
    }

    async exists(field, value) {
        const data = await db.q.query(`SELECT * FROM users WHERE ${field}='${value}';`);
        return Boolean(data.length);
    }

    async comparePassword(userRow, password) {
        return compareAsync(password, userRow.hash);
    }
}

module.exports = new User();
