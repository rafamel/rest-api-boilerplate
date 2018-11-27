import { request, response } from '../utils';

export const schemas = {
  User: {
    type: 'object',
    required: [
      'id',
      'username',
      'hash',
      'email',
      'role',
      'created_at',
      'updated_at'
    ],
    properties: {
      id: { type: 'integer', minimum: 0 },
      username: {
        type: 'string',
        minLength: 6,
        maxLength: 16,
        pattern: '^[a-zA-Z0-9_]+$'
      },
      hash: { type: 'string' },
      email: { type: 'string', format: 'email' },
      role: { type: 'integer' },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' }
    }
  }
};

const password = {
  type: 'string',
  minLength: 8,
  maxLength: 20,
  pattern: '^[a-zA-Z0-9_]+$'
};
export const requests = {
  UserRegister: request({
    type: 'object',
    required: ['username', 'password', 'email'],
    properties: {
      username: schemas.User.properties.username,
      password,
      email: schemas.User.properties.email
    }
  }),
  UserLogin: request({
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: schemas.User.properties.username,
      password
    }
  }),
  UserPatch: request({
    type: 'object',
    minProperties: 1,
    properties: {
      username: schemas.User.properties.username,
      password,
      email: schemas.User.properties.email
    }
  })
};

export const responses = {
  User: response({ $ref: '#/components/schemas/User' }),
  UserToken: response({
    type: 'object',
    required: ['user', 'token'],
    properties: {
      user: { $ref: '#/components/schemas/User' },
      token: { $ref: '#/components/schemas/Token' }
    }
  })
};
