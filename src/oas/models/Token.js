import { response } from '../utils';

export const schemas = {
  Token: {
    type: 'object',
    required: ['token_type', 'access_token', 'refresh_token', 'expires_in'],
    properties: {
      token_type: { type: 'string', enum: ['bearer'] },
      access_token: { type: 'string' },
      refresh_token: { type: 'string' },
      expires_in: {
        type: 'integer',
        description: 'Access token expiration time in ms.'
      }
    }
  }
};

export const requests = {};

export const responses = {
  Token: response({ $ref: '#/components/schemas/Token' })
};
