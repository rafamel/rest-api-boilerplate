import * as User from './models/User';
import * as Token from './models/Token';
import * as Todo from './models/Todo';

export default {
  schemas: {
    ...User.schemas,
    ...Token.schemas,
    ...Todo.schemas
  },
  requestBodies: {
    ...User.requests,
    ...Token.requests,
    ...Todo.requests
  },
  responses: {
    ...User.responses,
    ...Token.responses,
    ...Todo.responses
  },
  parameters: {
    id: {
      name: 'id',
      in: 'path',
      description: 'ID of the item to return',
      required: true,
      schema: { type: 'integer', minimum: 0 }
    }
  },
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT', // optional, for documentation purposes
      description:
        'User access token as header bearer token (Authorization: Bearer access_token)'
    }
  },
  examples: {},
  headers: {},
  links: {},
  callbacks: {}
};
