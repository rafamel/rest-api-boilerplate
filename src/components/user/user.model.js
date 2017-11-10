'use strict';
const path = require('path');
const { Model, ParentModel } = rootRequire('db/ParentModel');
const APIError = rootRequire('utils/api-error');
const config = rootRequire('config');
const { promisify } = require('util');
const bcrypt = require('bcrypt-nodejs');
const genSaltAsync = promisify(bcrypt.genSalt);
const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

module.exports = class User extends ParentModel {
    // Table Name
    static get tableName() { return 'users'; }

    // Schema (validation)
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'email', 'hash'],
            properties: {
                id: { type: 'integer' },
                username: { type: 'string', minLength: 1, maxLength: 255 },
                email: { type: 'string', minLength: 1, maxLength: 255 },
                hash: { type: 'string', minLength: 1, maxLength: 255 }
            }
        };
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
            }
        };
    }

    // Class Methods
    static get method() {
        return {
            existCheck: async (creationObj) => {
                if (!(await this.isCaseInsensitiveUnique('username', creationObj.username))) {
                    throw new APIError('Username already exists', { status: 400 });
                } else if (!await this.isCaseInsensitiveUnique('email', creationObj.email)) {
                    throw new APIError('Email already exists', { status: 400 });
                }
            },
            create: async (creationObj) => {
                // Check existance
                await this.method.existCheck(creationObj);

                // Hash password
                creationObj.hash = await hashAsync(
                    creationObj.password,
                    await genSaltAsync(config.auth.jwtSaltWorkFactor),
                    null
                );
                delete creationObj.password;

                // Insert values
                return this.query().insert(creationObj).returning('*');
            }
        };
    }

    // Instance Methods
    isPassword(password) {
        return compareAsync(password, this.hash);
    }
};
