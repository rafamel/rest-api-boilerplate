import { request, response } from '../utils';

const SCHEMA = 'Todo';
export const schemas = {
  [SCHEMA]: {
    type: 'object',
    required: ['name', 'done', 'user_id', 'created_at', 'id'],
    properties: {
      id: { type: 'integer', minimum: 0 },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      done: { type: 'boolean' },
      user_id: { type: 'integer', minimum: 0 },
      created_at: { type: 'string', format: 'date-time' },
      updated_at: { type: 'string', format: 'date-time' }
    }
  }
};

export const requests = {
  [SCHEMA + 'Create']: request({
    type: 'object',
    required: ['name', 'done'],
    properties: {
      name: schemas[SCHEMA].properties.name,
      done: schemas[SCHEMA].properties.done
    }
  }),
  [SCHEMA + 'Patch']: request({
    type: 'object',
    minProperties: 1,
    properties: {
      name: schemas[SCHEMA].properties.name,
      done: schemas[SCHEMA].properties.done
    }
  })
};

export const responses = {
  [SCHEMA]: response({
    $ref: `#/components/schemas/${SCHEMA}`
  }),
  [SCHEMA + 's']: response({
    type: 'array',
    items: { $ref: `#/components/schemas/${SCHEMA}` }
  })
};
