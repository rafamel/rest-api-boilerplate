'use strict';
const path = require('path');
const { Model, ParentModel } = rootRequire('db/ParentModel');
const { Joi, Flow, KeyFlow } = require('flowi');
const APIError = rootRequire('utils/api-error');

module.exports = class Todo extends ParentModel {
    // Table Name
    static get tableName() { return 'todo'; }

    // Database Schema validation
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name', 'user_id'],
            properties: {
                id: { type: 'integer' },
                name: { type: 'string', minLength: 1, maxLength: 255 },
                done: { type: 'boolean', default: false },
                user_id: { type: 'integer' }
            }
        };
    }

    // Request validation schema
    static get reqSchema() {
        return KeyFlow({
            name: Joi.string().min(1).max(255),
            done: Flow(Joi.boolean()).convert()
        }).labels({ name: 'Todo name' });
    }

    // Assert unique values for fields
    static get uniqueConstraints() {
        return [
            { name: 'name', label: 'Name', insensitive: true, for: ['user_id'] } // , message: `Name already in use` }
        ];
    }

    // Checks before insert and update
    static beforeChecks(newInstance, oldInstance) {
        // return [ async () => { } ];
    }

    // Associations
    static get relationMappings() {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: path.join(__dirname, '../user/user.model'),
                join: {
                    from: 'todo.user_id',
                    to: 'users.id'
                }
            }
        };
    }

    // Class Methods
    static get method() {
        // return { method: async () => { } };
    }

    // InstanceMethods
    assertOwner(user) {
        if (this.user_id !== user.id) {
            throw new APIError(`You don't have access to this resource.`, { status: 401 });
        }
        return this;
    }
};
