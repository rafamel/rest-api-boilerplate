'use strict';
const path = require('path');
const { Model, ParentModel } = rootRequire('db/ParentModel');

const { APIError, ErrorTypes } = rootRequire('utils/api-error');
const config = rootRequire('config');
const ms = require('ms');
const moment = require('moment');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

module.exports = class RefreshToken extends ParentModel {
    // Table Name
    static get tableName() { return 'refresh_token'; }

    // Database Schema validation
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['token', 'expires', 'user_id'],
            properties: {
                id: { type: 'integer' },
                token: { type: 'string', minLength: 1, maxLength: 255 },
                expires: { type: 'string' },
                user_id: { type: 'integer' }
            }
        };
    }

    // Associations
    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: path.join(__dirname, '../user/user.model'),
                join: {
                    from: 'refresh_token.user_id',
                    to: 'users.id'
                }
            }
        };
    }

    // Class Methods
    static get method() {
        return {
            create: async (user) => {
                // A new refresh token must be issued
                const newRefreshToken = {
                    user_id: user.id,
                    token: `${crypto.randomBytes(40).toString('hex')}`,
                    expires: String(
                        moment()
                            .add(ms(config.auth.refreshToken.expiry), 'ms')
                            .toISOString()
                    )
                };
                return this.query()
                    .insert(newRefreshToken)
                    .returning('*');
            },
            get: async (fullToken) => {
                const [id, token] = fullToken.split('.');
                const dbToken = await this.query().findById(id);
                if (!dbToken || dbToken.token !== token) {
                    throw new APIError('Invalid token',
                        { type: ErrorTypes.Unauthorized });
                }
                return dbToken;
            }
        };
    }

    // Instance Methods
    get fullToken() {
        return `${this.id}.${this.token}`;
    }

    async runChecks(user) {
        // Check user id
        if (!user || this.user_id !== user.id) {
            throw new APIError('Invalid token',
                { type: ErrorTypes.Unauthorized });
        }

        // Check expiration
        const expiry = moment(this.expires);
        const currentUnix = moment().unix();
        if (currentUnix > expiry.unix()) {
            throw new APIError('Invalid token',
                { type: ErrorTypes.Unauthorized });
        }

        // Create new refreshToken if needed
        const remaining = expiry.subtract(
            ms(config.auth.refreshToken.renewRemaining), 'ms'
        );
        if (currentUnix >= remaining.unix()) {
            await this.$query().delete();
            const refreshToken = await this.constructor.method.create(user);
            return refreshToken.fullToken;
        }
        return this.fullToken;
    }

    async newAccessToken(user) {
        function generateAccessToken() {
            const payload = {
                iat: moment().unix(),
                user: user
            };
            return jwt.sign(payload, config.auth.jwtSecret, {
                algorithm: config.auth.jwtAlgorithm,
                expiresIn: config.auth.jwtAuthExpiry
            });
        }
        // Check refresh token
        const fullToken = await this.runChecks(user);

        return {
            token_type: 'bearer',
            access_token: generateAccessToken(),
            refresh_token: fullToken,
            expires_in: ms(config.auth.jwtAuthExpiry)
        };
    }
};
