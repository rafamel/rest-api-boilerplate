const path = require('path');
const Joi = require('~/utils/joi');
const mergeWith = require('lodash.mergewith');

// Load environment variables from file
require('dotenv-safe').load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example')
});

function dbUrlPass(url, pass) {
  if (url.match(/:.*:.*@/)) return url;
  const [a, c] = url.split('@');
  return `${a}:${pass}@${c}`;
}

// Validating NODE_ENV as one of
// 'production', 'development', 'test'
const env = Joi.attempt(
  process.env.NODE_ENV,
  Joi.string()
    .default('development')
    .valid(['production', 'development', 'test'])
    .label('NODE_ENV')
);

function onEnv(config, envConfigs) {
  const customMerge = (objValue, srcValue) => {
    if (Array.isArray(objValue)) return srcValue;
  };

  const schema = Joi.object().keys({
    production: Joi.object(),
    development: Joi.object(),
    test: Joi.object()
  });

  Joi.assert(envConfigs, schema);
  if (!envConfigs.hasOwnProperty(env)) return config;
  return mergeWith(config, envConfigs[env], customMerge);
}

module.exports = { env, onEnv, dbUrlPass };
