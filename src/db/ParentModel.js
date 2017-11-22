'use strict';
const { Model, AjvValidator } = require('objection');
const { APIError, ErrorTypes } = rootRequire('utils/api-error');

class ParentQueryBuilder extends Model.QueryBuilder {
    notNone(label = 'Item') {
        return this.runAfter((res, builder) => {
            const thrower = () => {
                throw new APIError(`${label} not found.`, {
                    type: ErrorTypes.DatabaseNotFound
                });
            };
            if (Array.isArray(res)) {
                if (res.length === 0) return thrower();
            } else if (res === null || res === undefined || res === 0) {
                return thrower();
            }
            return res;
        });
    }
}

class ParentModel extends Model {
    static get QueryBuilder() {
        return ParentQueryBuilder;
    }

    static createValidator() {
        return new AjvValidator({
            onCreateAjv: ajv => {
                /* Do Nothing by default */
            },
            options: {
                allErrors: false,
                validateSchema: true,
                ownProperties: true,
                v5: true
            }
        });
    }

    $beforeInsert(...args) {
        const parent = super.$beforeInsert(...args);
        return Promise.resolve(parent).then(() => {
            this.created_at = (new Date()).toISOString();
        });
    }

    $beforeUpdate(...args) {
        const parent = super.$beforeUpdate(...args);
        return Promise.resolve(parent).then(() => {
            this.updated_at = (new Date()).toISOString();
        });
    }
}

module.exports = {
    Model,
    ParentModel
};
