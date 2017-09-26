'use strict';
const config = require('../../../config');
const db = require('../../database/db_connect');
const modeler = require('../../utils/modeler');
const PublicError = require('../../utils/public-error');

const Joi = require('joi');
const { promisify } = require('util');
const bcrypt = require('bcrypt-nodejs');
const genSaltAsync = promisify(bcrypt.genSalt);
const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

class User {
    constructor() { }

    // Public
    async create(creationObj) {

        // Check existance
        if (await this.exists('username', creationObj.username)) {
            throw new PublicError('Username already exists', { status: 401 });
        } else if (await this.exists('email', creationObj.email)) {
            throw new PublicError('Email already exists', { status: 401 });
        }

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
            throw new PublicError(
                'User was registered but there was an error retrieving the user data',
                { err: err }
            );
        }
    }

    async get(id) {
        return db.q.oneOrNone(`SELECT * FROM users WHERE id='${id}';`);
    }

    async getAll() {
        return db.q.query(`SELECT * FROM users;`);
    }

    // Private
    async getOneBy(field, value) {
        return db.q.oneOrNone(`SELECT * FROM users WHERE ${field}='${value}'`);
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
