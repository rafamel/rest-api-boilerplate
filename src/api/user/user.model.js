const path = require('path');
const Joi = require('~/utils/joi');
const Model = require('~/db/Model');
const beforeUnique = require('objection-before-and-unique');

const config = require('~/config');
const { promisify } = require('util');
const bcrypt = require('bcrypt-nodejs');
const genSaltAsync = promisify(bcrypt.genSalt);
const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

module.exports = class User extends beforeUnique({
  before: [
    async ({ instance }) => {
      if (instance.password) {
        instance.hash = await hashAsync(
          instance.password,
          await genSaltAsync(config.auth.jwtSaltWorkFactor),
          null
        );
        delete instance.password;
      }
    }
  ],
  schema: Joi.object().keys({
    hash: Joi.string()
      .min(1)
      .max(255)
      .label('Hash'),
    password: Joi.any().forbidden(),
    role: Joi.number()
      .integer()
      .valid(0)
  }),
  unique: [
    { col: 'username', label: 'Username', insensitive: true },
    { col: 'email', label: 'Email', insensitive: true }
  ]
})(Model) {
  // Table Name
  static tableName = 'users';

  // Database Schema (validation)
  static jsonSchema = {
    type: 'object',
    required: ['username', 'email', 'password'],
    properties: {
      id: { type: 'integer' },
      username: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', minLength: 1, maxLength: 255 },
      role: { type: 'number', default: 0, minLength: 1, maxLength: 255 },
      // `password` will go into 'hash'
      password: { type: 'string', minLength: 1, maxLength: 255 }
    }
  };

  // Associations
  static relationMappings = {
    refreshTokens: {
      relation: Model.HasManyRelation,
      modelClass: path.join(__dirname, 'auth.model'),
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

  // Instance Methods
  isPassword(password) {
    return compareAsync(password, this.hash);
  }
};
