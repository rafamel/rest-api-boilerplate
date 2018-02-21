const path = require('path');
const Joi = require('~/utils/joi');

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

module.exports = { env, dbUrlPass };
