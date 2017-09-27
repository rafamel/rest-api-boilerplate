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
    label(label) {
        this._label = label;
        return this;
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
    validate(obj) {
        for (let item of this.stack) {
            let { validation, message } = item;
            if (this._label) validation = validation.label(this._label);
            let { error: err } = Joi.validate(obj, validation);
            if (err) {
                err.message = err.message.replace('"', '').replace('"', '');
                return new ValidationError((message || err.message), {
                    note: err.message,
                    isExplicit: Boolean(message),
                    label: this._label
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
    constructor(schema, msgDefault) {
        this.isFlowi = true;
        this.stack = [];
        this.priorityStack = [];
        this._labels = {};
        this._and(schema, msgDefault);
    }
    and(schema, msgDefault) {
        return this._and(schema, msgDefault);
    }
    labels(labelsObj) {
        let { error } = Joi.validate(labelsObj, Joi.object().pattern(/.*/, Joi.string()));
        if (error) throw Error('Labels didn\'t receive a valid object with strings.');

        for (let key of Object.keys(labelsObj)) {
            this._labels[key] = labelsObj[key];
        }
        return this;
    }
    require(stringArray) {
        let { error } = Joi.validate(stringArray, Joi.array().items(Joi.string()));
        if (error) throw Error('Require didn\'t receive a valid array of strings.');

        const obj = {};
        stringArray.forEach(key => { obj[key] = Joi.any().required(); });
        this._and(obj, undefined, true);
        return this;
    }
    forbid(stringArray) {
        let { error } = Joi.validate(stringArray, Joi.array().items(Joi.string()));
        if (error) throw Error('Forbid didn\'t receive a valid array of strings.');
        this._and((obj) => {
            for (let str of stringArray) {
                if (Object.prototype.hasOwnProperty.call(obj, str)) {
                    let label;
                    let message = `${str} is not allowed`;
                    if (this._labels.hasOwnProperty(str)) {
                        label = this._labels[str];
                        message = `${label} is not allowed`;
                    }
                    return new ValidationError(message, { note: message, label: label });
                }
            }
        }, undefined, true);
        return this;
    }
    validate(obj) {
        const stack = this.priorityStack.concat(this.stack);
        for (let item of stack) {
            const { schema, message } = item;
            let err;
            if (typeof schema === 'object') {
                if (schema.isJoi) err = this._validateJoy(obj, schema, message);
                if (schema.isFlowi) {
                    err = schema.validate(obj);
                    if (message & err && !err.isExplicit) err.message = message;
                } else err = this._runSchema(obj, schema, message);
            } else if (typeof schema === 'function') {
                err = schema(obj);
                if (err) {
                    if (!(err instanceof Error)) {
                        throw new Error('No valid Error object was returned by a custom function.');
                    }
                    if (message) err = this._toFlowiError(err, message);
                }
            } else throw new Error('No valid Joi validation, object, or function was provided.');
            if (err) return err;
        }
    }
    assert(obj) {
        const err = this.validate(obj);
        if (err) throw err;
    }
    async validateAsync(obj) {
        try {
            const stack = this.priorityStack.concat(this.stack);
            for (let item of stack) {
                const { schema, message } = item;
                let err;
                if (typeof schema === 'object') {
                    if (schema.isJoi) err = this._validateJoy(obj, schema, message);
                    if (schema.isFlowi) {
                        err = await schema.validate(obj);
                        if (message & err && !err.isExplicit) err.message = message;
                    } else err = this._runSchema(obj, schema, message);
                } else if (typeof schema === 'function') {
                    err = await schema(obj);
                    if (err) {
                        if (!(err instanceof Error)) {
                            throw new Error('No valid Error object was returned by a custom function.');
                        }
                        if (message) err = this._toFlowiError(err, message);
                    }
                } else throw new Error('No valid Joi validation, object, or function was provided.');
                if (err) return err;
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
    _and(schema, msgDefault, priority = false) {
        if (msgDefault && typeof msgDefault !== 'string') {
            throw Error('Message wasn\'t a string.');
        }
        if (!schema) return this;
        const stack = (priority) ? 'priorityStack' : 'stack';
        this[stack].push({ schema: schema, message: msgDefault });
        if (schema.isFlowi) this.labels(schema._labels);
        return this;
    }
    _validateJoy(obj, schema, message) {
        const { error } = Joi.validate(obj, schema);
        if (error) {
            if (message) return this._toFlowiError(error, message);

            // eslint-disable-next-line
            const match = error.message.match(/\"[^\"]+\"/);
            if (!match) return this._toFlowiError(error);

            const key = match[0].slice(1, -1);
            if (!this._labels.hasOwnProperty(key)) return this._toFlowiError(error);

            const msgMatch = error.message.match(/\[[^\]]+\]/);
            if (msgMatch) error.message = msgMatch[0].slice(1, -1);
            error.message = error.message.replace(key, this._labels[key]);
            return this._toFlowiError(error, undefined, this._labels[key]);
        }
    }
    _runSchema(obj, schema, message) {
        for (let key of Object.keys(schema)) {
            let validation = schema[key];
            let err;
            if (validation.isFlowi) {
                err = (validation._label)
                    ? validation.validate(obj[key])
                    : validation.label(this._labels[key] || key).validate(obj[key]);
            } else if (validation.isJoi) {
                let incomingLabel = validation._flags.label;
                if (!incomingLabel && this._labels.hasOwnProperty(key)) {
                    incomingLabel = this._labels[key];
                    validation = validation.label(incomingLabel);
                } else validation = validation.label(key);
                const { error } = Joi.validate(obj[key], validation);
                if (error) err = this._toFlowiError(error, message, incomingLabel);
            } else {
                throw new Error(`No valid validation was provided for key ${key}`);
            }
            if (err) return err;
        }
    }
    _toFlowiError(err, message, label) {
        err = new ValidationError(
            (message || err.message.replace('"', '').replace('"', '')),
            { note: (err.message || err), isExplicit: Boolean(message), label: label }
        );
        return err;
    }
}

module.exports = {
    flow: (...args) => new Flow(...args),
    keyFlow: (...args) => new KeyFlow(...args),
    ValidationError: ValidationError
};
