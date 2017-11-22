'use strict';
const path = require('path');
const Joi = require('joi');

// Load environment variables from file
require('dotenv-safe').load({
    path: path.join(__dirname, '../../config.env'),
    sample: path.join(__dirname, '../../config.env.example')
});

// Validating NODE_ENV as one of
// 'production', 'development', 'test'
const env = Joi.attempt(
    process.env.NODE_ENV,
    Joi.string()
        .default('development')
        .valid(['production', 'development', 'test'])
        .label('NODE_ENV')
);

module.exports = {
    env,
    onEnv(obj) {
        // Helper - Get the right config value for current env.
        // Validate input as object with required 'default'
        // key and optional 'production', 'development', and 'test' keys
        Joi.assert(
            obj,
            Joi.object().keys({
                default: Joi.any(),
                production: Joi.any(),
                development: Joi.any(),
                test: Joi.any()
            }).requiredKeys(['default'])
        );
        // Get and return config value
        return obj.hasOwnProperty(env) ? obj[env] : obj.default;
    }
};
