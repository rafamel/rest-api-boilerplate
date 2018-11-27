import { request, response, operationId } from '../utils';

export default {
  '/api/user/register': {
    post: {
      tags: ['user'],
      ...operationId('registerUser'), // operationId, summary, description
      summary: 'User registration',
      parameters: [],
      requestBody: { $ref: '#/components/requestBodies/UserRegister' },
      responses: {
        200: { $ref: '#/components/responses/UserToken' }
      }
    }
  },
  '/api/user/login': {
    post: {
      tags: ['user'],
      ...operationId('loginUser'), // operationId, summary, description
      summary: 'User login',
      parameters: [],
      requestBody: { $ref: '#/components/requestBodies/UserLogin' },
      responses: {
        200: { $ref: '#/components/responses/UserToken' }
      }
    }
  },
  '/api/user/refresh': {
    post: {
      tags: ['user'],
      ...operationId('refreshToken'), // operationId, summary, description
      parameters: [],
      requestBody: request({
        type: 'object',
        required: ['userId', 'refreshToken'],
        properties: {
          userId: { type: 'integer' },
          refreshToken: { type: 'string' }
        }
      }),
      responses: {
        200: { $ref: '#/components/responses/Token' }
      }
    }
  },
  '/api/user/{id}': {
    get: {
      tags: ['user'],
      ...operationId('showUser'), // operationId, summary, description
      parameters: [{ $ref: '#/components/parameters/id' }],
      // requestBody: {},
      responses: {
        200: { $ref: '#/components/responses/User' }
      },
      security: [{ bearerAuth: [] }]
    },
    patch: {
      tags: ['user'],
      ...operationId('patchUser'), // operationId, summary, description
      parameters: [{ $ref: '#/components/parameters/id' }],
      requestBody: { $ref: '#/components/requestBodies/UserPatch' },
      responses: {
        200: { $ref: '#/components/responses/User' }
      },
      security: [{ bearerAuth: [] }]
    },
    delete: {
      tags: ['user'],
      ...operationId('deleteUser'), // operationId, summary, description
      parameters: [{ $ref: '#/components/parameters/id' }],
      requestBody: { $ref: '#/components/requestBodies/UserPatch' },
      responses: {
        200: response({ type: 'boolean', enum: [true] })
      },
      security: [{ bearerAuth: [] }]
    }
  }
};
