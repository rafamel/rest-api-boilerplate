'use strict';
const Joi = require('joi');

// Error
class ValidationError extends Error {
    constructor(message, { note, isExplicit, label }) {
        super(message);
        this.isFlowi = true;
        this.isExplicit = isExplicit || false;
        this.note = note || message;
        this.label = label;
    }
}

// Flow
class Flow {
    constructor(validation, message) {
        if (validation && !validation.isJoi) {
            throw new Error('No valid Joi validation was provided.');
        }
        this.isFlowi = true;
        this.stack = (validation) ? [{ validation: validation, message: message }] : [];
    }
    and(validation, message) {
        if ((!validation) && !validation.isJoi) {
            throw new Error('No valid Joi validation was provided.');
        }
        if (validation) {
            this.stack.push({ validation: validation, message: message });
        }
        return this;
    }
    label(tag) {
        this.tag = tag;
        return this;
    }
    validate(obj) {
        for (let item of this.stack) {
            let { validation, message } = item;
            if (this.tag) validation = validation.label(this.tag);
            let { error: err } = Joi.validate(obj, validation);
            if (err) {
                err.message = err.message.replace('"', '').replace('"', '');
                return new ValidationError((message || err.message), {
                    note: err.message,
                    isExplicit: Boolean(message),
                    label: this.tag
                });
            }
        };
    }
    assert(obj) {
        const err = this.validate(obj);
        if (err) throw err;
    }
}

// KeyFlow
class KeyFlow {
    constructor(schema, msgOverride) {
        this.isFlowi = true;
        this.stack = (schema) ? [{ schema: schema, message: msgOverride }] : [];
    }
    and(schema, msgOverride) {
        if (schema) this.stack.push({ schema: schema, message: msgOverride });
        return this;
    }
    require(obj) {
        Object.keys(obj).forEach(key => {
            const label = obj[key];
            if (typeof label !== 'string') {
                throw Error('No string provided for some key on required fields');
            }
            obj[key] = Joi.any().label(label).required();
        });
        this.and(obj);
        return this;
    }
    validate(obj) {
        for (let item of this.stack) {
            const { schema, message } = item;
            if (typeof schema === 'object') {
                let err = this._runSchema(obj, schema, message);
                if (err) return err;
            } else if (typeof schema === 'function') {
                let err = schema(obj);
                if (err) {
                    if (message) {
                        err = new ValidationError(message, {
                            note: err.message || err,
                            isExplicit: true
                        });
                    }
                    return err;
                }
            } else throw new Error('No valid object or function was provided.');
        }
    }
    assert(obj) {
        const err = this.validate(obj);
        if (err) throw err;
    }
    async validateAsync(obj) {
        try {
            for (let item of this.stack) {
                const { schema, message } = item;
                if (typeof schema === 'object') {
                    let err = this._runSchema(obj, schema, message);
                    if (err) return err;
                } else if (typeof schema === 'function') {
                    let err = await schema(obj);
                    if (err) return (message || err);
                } else throw new Error('No valid object or function was provided.');
            }
        } catch (err) { throw err; };
    }
    async assertAsync(obj) {
        try {
            const err = await this.validateAsync(obj);
            if (err) throw err;
        } catch (err) { throw err; };
    }

    // Private
    _runSchema(obj, schema, message) {
        for (let key of Object.keys(schema)) {
            let validation = schema[key];
            let err;
            if (validation.isFlowi) {
                err = (validation.tag)
                    ? validation.validate(obj[key])
                    : validation.label(key).validate(obj[key]);
            } else if (validation.isJoi) {
                const incomingLabel = validation._flags.label;
                if (!incomingLabel) validation = validation.label(key);
                const res = Joi.validate(obj[key], validation);
                err = res.error;
                if (err) {
                    err.message = err.message.replace('"', '').replace('"', '');
                    err = new ValidationError((message || err.message), {
                        note: err.message,
                        isExplicit: Boolean(message),
                        label: incomingLabel
                    });
                }
            } else {
                throw new Error(`No valid validation was provided for key ${key}`);
            }
            if (err) return err;
        }
    };
}

module.exports = {
    flow: (...args) => new Flow(...args),
    keyFlow: (...args) => new KeyFlow(...args),
    ValidationError: ValidationError
};
