import { response, operationId } from '../utils';

const TAG = 'todo';
const SCHEMA = 'Todo';

export default {
  [`/api/${TAG}`]: {
    get: {
      tags: [TAG],
      ...operationId('list', SCHEMA), // operationId, summary, description
      parameters: [],
      responses: {
        200: { $ref: `#/components/responses/${SCHEMA}s` }
      },
      security: [{ bearerAuth: [] }]
    },
    post: {
      tags: [TAG],
      ...operationId('create', SCHEMA), // operationId, summary, description
      parameters: [],
      requestBody: { $ref: `#/components/requestBodies/${SCHEMA}Create` },
      responses: {
        200: { $ref: `#/components/responses/${SCHEMA}` }
      },
      security: [{ bearerAuth: [] }]
    }
  },
  [`/api/${TAG}/{id}`]: {
    get: {
      tags: [TAG],
      ...operationId('show', SCHEMA), // operationId, summary, description
      parameters: [{ $ref: '#/components/parameters/id' }],
      responses: {
        200: { $ref: `#/components/responses/${SCHEMA}` }
      },
      security: [{ bearerAuth: [] }]
    },
    put: {
      tags: [TAG],
      ...operationId('update', SCHEMA), // operationId, summary, description
      parameters: [{ $ref: '#/components/parameters/id' }],
      requestBody: { $ref: `#/components/requestBodies/${SCHEMA}Create` },
      responses: {
        200: { $ref: `#/components/responses/${SCHEMA}` }
      },
      security: [{ bearerAuth: [] }]
    },
    patch: {
      tags: [TAG],
      ...operationId('patch', SCHEMA), // operationId, summary, description
      parameters: [{ $ref: '#/components/parameters/id' }],
      requestBody: { $ref: `#/components/requestBodies/${SCHEMA}Patch` },
      responses: {
        200: { $ref: `#/components/responses/${SCHEMA}` }
      },
      security: [{ bearerAuth: [] }]
    },
    delete: {
      tags: [TAG],
      ...operationId('delete', SCHEMA), // operationId, summary, description
      parameters: [{ $ref: '#/components/parameters/id' }],
      responses: {
        200: response({ type: 'boolean', enum: [true] })
      },
      security: [{ bearerAuth: [] }]
    }
  }
};
