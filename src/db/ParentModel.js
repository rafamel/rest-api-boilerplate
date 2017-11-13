'use strict';
const Model = require('objection').Model;
const Joi = require('joi');

class BaseModel extends Model {
    $beforeInsert() {
        this.created_at = (new Date()).toISOString();
    }

    $beforeUpdate() {
        this.updated_at = (new Date()).toISOString();
    }
}

class ParentModel extends BaseModel {
    $beforeInsert(queryContext) {
        const parent = super.$beforeInsert(queryContext);
        return this.runBeforeChecks(parent);
    }

    $beforeUpdate(updateOpts, queryContext) {
        const parent = super.$beforeUpdate(updateOpts, queryContext);
        if ((this.constructor.uniqueConstraints || this.constructor.beforeChecks)
            && !updateOpts.old) {
            throw new Error(`'uniqueConstraints' and 'beforeChecks' at update only work with instance queries ($query()).`);
        }
        return this.runBeforeChecks(parent, updateOpts.old);
    }

    async runBeforeChecks(parent, oldInstance) {
        const runner = async () => {
            const uniqueConstraints = this.constructor.uniqueConstraints;
            const beforeChecks = this.constructor.beforeChecks;
            if (!(uniqueConstraints || beforeChecks)) return;

            const fns = (beforeChecks)
                ? this.constructor.beforeChecks(this, oldInstance) || []
                : [];

            if (uniqueConstraints) {
                // Validate uniqueConstraints schema
                const ucSchema = Joi.array().items(
                    Joi.object().keys({
                        name: Joi.string(),
                        label: Joi.string(),
                        insensitive: Joi.boolean(),
                        message: Joi.string(),
                        for: Joi.array().items(Joi.string())
                    }).requiredKeys('name')
                );
                const { error } = Joi.validate(uniqueConstraints, ucSchema);
                if (error) throw new Error(`${error.message} on uniqueConstraints.`);

                let ids = this.constructor.idColumn;
                if (!Array.isArray(ids)) ids = [ids];
                for (let constraint of uniqueConstraints) {
                    fns.push(
                        async () => {
                            const query = this.constructor.query().first().whereRaw(
                                (constraint.insensitive)
                                    ? `LOWER(${constraint.name}) = LOWER('${this[constraint.name]}')`
                                    : `${constraint.name} = '${this[constraint.name]}'`
                            );
                            if (constraint.for) {
                                constraint.for.forEach(col => {
                                    if (this.hasOwnProperty(col)) {
                                        query.where(col, this[col]);
                                    } else if (oldInstance
                                        && oldInstance.hasOwnProperty(col)) {
                                        query.where(col, oldInstance[col]);
                                    }
                                });
                            }
                            if (oldInstance) {
                                ids.forEach(id => {
                                    query.whereNot(id, oldInstance[id]);
                                });
                            }
                            if (await query) {
                                const err = {};
                                err[constraint.name] = [{
                                    message: (constraint.message)
                                        ? constraint.message
                                        : `${constraint.label || constraint.name} already exists.`,
                                    keyword: 'unique'
                                }];
                                throw Model.createValidationError(err);
                            }
                        }
                    );
                }
            }
            for (let fn of fns) { await fn(); }
        };

        await parent;
        await runner();
    }
};

module.exports = {
    Model,
    ParentModel
};
