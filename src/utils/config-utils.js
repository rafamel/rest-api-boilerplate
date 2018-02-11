import path from 'path';
import Joi from 'joi';
import dotEnvSafe from 'dotenv-safe';

// Load environment variables from file
dotEnvSafe.load({
  path: path.join(__dirname, '../../.env'),
  sample: path.join(__dirname, '../../.env.example')
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

function onEnv(obj) {
  // Get the right config value for current env.
  // Validate input as object with required 'default'
  // key and optional 'production', 'development',
  // and 'test' keys
  Joi.assert(
    obj,
    Joi.object()
      .keys({
        default: Joi.any(),
        production: Joi.any(),
        development: Joi.any(),
        test: Joi.any()
      })
      .requiredKeys(['default'])
  );
  // Get and return config value
  return obj.hasOwnProperty(env) ? obj[env] : obj.default;
}

export { env, onEnv };
