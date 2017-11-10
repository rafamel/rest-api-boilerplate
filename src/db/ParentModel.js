'use strict';
const Model = require('objection').Model;

class ParentModel extends Model {
    $beforeInsert() {
        this.created_at = (new Date()).toISOString();
    }

    $beforeUpdate() {
        this.updated_at = (new Date()).toISOString();
    }

    static async isUnique(field, value) {
        return !(
            await this.query().first().where(field, value)
        );
    }

    static async isCaseInsensitiveUnique(field, value) {
        return !(
            await this.query().first().whereRaw(`LOWER(${field}) = '${value.toLowerCase()}'`)
        );
    }
};

module.exports = {
    Model,
    ParentModel
};
