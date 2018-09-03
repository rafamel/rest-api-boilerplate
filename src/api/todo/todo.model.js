import path from 'path';
import Model from '~/db/Model';
import beforeUnique from 'objection-before-and-unique';
import { PublicError, ErrorTypes } from 'ponds';

export default class Todo extends beforeUnique({
  unique: [{ col: 'name', label: 'Name', insensitive: true, for: ['user_id'] }]
})(Model) {
  // Table Name
  static tableName = 'todo';

  // Database Schema validation
  static jsonSchema = {
    type: 'object',
    required: ['name', 'user_id'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      done: { type: 'boolean', default: false },
      user_id: { type: 'integer' }
    }
  };

  // Associations
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, '../user/user.model'),
      join: {
        from: 'todo.user_id',
        to: 'users.id'
      }
    }
  };

  // Instance Methods
  assertOwner(user) {
    if (this.user_id !== user.id) {
      throw new PublicError(ErrorTypes.Unauthorized);
    }
    return this;
  }
}
