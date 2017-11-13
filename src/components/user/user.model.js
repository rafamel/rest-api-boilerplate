'use strict';
const path = require('path');
const { Model, ParentModel } = rootRequire('db/ParentModel');
const { Joi, Flow, KeyFlow } = require('flowi');

const config = rootRequire('config');
const { promisify } = require('util');
const bcrypt = require('bcrypt-nodejs');
const genSaltAsync = promisify(bcrypt.genSalt);
const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

module.exports = class User extends ParentModel {
    // Table Name
    static get tableName() { return 'users'; }

    // Database Schema (validation)
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'email', 'password'],
            properties: {
                id: { type: 'integer' },
                username: { type: 'string', minLength: 1, maxLength: 255 },
                email: { type: 'string', minLength: 1, maxLength: 255 },
                role: { type: 'number', default: 0, minLength: 1, maxLength: 255 },
                // `password` will go into `hash`
                password: { type: 'string', minLength: 1, maxLength: 255 }
            }
        };
    }

    // Request validation schema
    static get reqSchema() {
        return KeyFlow({
            username: Flow()
                .and(Joi.string().min(6).max(16), 'Username should have a length of 6 to 16 characters.')
                .and(Joi.string().regex(/^[a-zA-Z0-9_]+$/), 'Username should only contain letters, numbers, and underscores (_).'),
            password: Flow()
                .and(Joi.string().min(8).max(20), 'Password should have a length of 8 to 20 characters.')
                .and(Joi.string().regex(/^[a-zA-Z0-9_]+$/), 'Password should only contain letters, numbers, and underscores (_).')
                .and(Joi.string().regex(/[a-zA-Z]/), 'Password should contain some letters.'),
            email: Joi.string().email()
        }).labels({
            username: 'Username',
            email: 'Email',
            password: 'Password'
        });
    }

    // Assert unique values for fields
    static get uniqueConstraints() {
        return [
            { name: 'username', label: 'Username', insensitive: true },
            { name: 'email', label: 'Email', insensitive: true }
        ];
    }

    // Checks before insert and update
    static beforeChecks(newInstance, oldInstance) {
        return [
            async () => {
                newInstance.hash = await hashAsync(
                    newInstance.password,
                    await genSaltAsync(config.auth.jwtSaltWorkFactor),
                    null
                );
                Joi.assert(
                    newInstance.hash,
                    Joi.string().min(1).max(255).label('Hash')
                );
                delete newInstance.password;
            }
        ];
    }

    // Associations
    static get relationMappings() {
        return {
            refreshTokens: {
                relation: Model.HasManyRelation,
                modelClass: path.join(__dirname, '../auth/auth.model'),
                join: {
                    from: 'users.id',
                    to: 'refresh_token.user_id'
                }
            },
            todos: {
                relation: Model.HasManyRelation,
                modelClass: path.join(__dirname, '../todo/todo.model'),
                join: {
                    from: 'users.id',
                    to: 'todo.user_id'
                }
            }
        };
    }

    // Class Methods
    static get method() {
        // return { method: async () => { } };
    }

    // Instance Methods
    isPassword(password) {
        return compareAsync(password, this.hash);
    }
};
