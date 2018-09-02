const path = require('path');
const dotEnv = require('dotenv');
const requiredEnv = (arr) => {
  if (!arr.filter((x) => !process.env[x]).length) return;
  throw Error(`Required environment variables: ${arr.join(', ')}`);
};

// Get env variables from .env file
dotEnv.config({ path: path.join(__dirname, '../.env') });

// Set env variables as required
requiredEnv(['DB_URL', 'JWT_SECRET']);
module.exports = {
  production: process.env.NODE_ENV === 'production',
  port: process.env.PORT || 80,
  logs: {
    morgan: 'combined',
    transports: { console: false, file: true },
    levels: { console: 'debug', file: 'info' }
  },
  db: {
    client: 'pg',
    connection: process.env.DB_URL,
    pool: { min: 2, max: 10 },
    debug: false,
    migrations: { directory: './src/db/migrations' },
    seeds: { directory: './src/db/seeds' }
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    jwtSaltWorkFactor: process.env.JWT_SALT_WORK_FACTOR || 12,
    jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
    jwtAuthExpiry: '15m',
    refreshToken: { expiry: '45d', renewRemaining: '15d' }
  },
  validation: {
    abortEarly: false,
    convert: false,
    stripUnknown: true,
    presence: 'optional',
    language: { root: 'Value', key: '{{!label}} ' }
  }
};
