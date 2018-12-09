import path from 'path';
import dotenv from 'dotenv';
import config, { requireEnv } from 'slimconf';

// Retrieve env file variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Set env variables as required
requireEnv('DB_URL', 'JWT_SECRET');

const setup = {
  env: {
    default: process.env.NODE_ENV,
    map(env) {
      return env === 'production' || env === 'test' ? env : 'development';
    }
  }
};
export default config(setup, ({ env }, on) => ({
  env: {
    production: env === 'production',
    development: env === 'development',
    test: env === 'test'
  },
  port: on.env({
    default: process.env.PORT || 80,
    development: 3000,
    test: 3061
  }),
  logs: on.env({
    default: {
      morgan: 'dev',
      transports: { console: true, file: false },
      levels: { console: 'debug', file: 'info' }
    },
    production: {
      morgan: 'combined',
      transports: { console: false, file: true }
    },
    test: { transports: { console: false, file: false } }
  }),
  db: on.env({
    default: {
      client: 'pg',
      connection: process.env.DB_URL,
      pool: { min: 2, max: 10 },
      migrations: { directory: './src/db/migrations' },
      seeds: { directory: './src/db/seeds' },
      debug: false
    },
    development: {
      connection: 'postgres://postgres:pass@localhost:5432/testdb',
      debug: true
    }
  }),
  auth: on.env({
    default: {
      jwtSecret: process.env.JWT_SECRET,
      jwtSaltWorkFactor: process.env.JWT_SALT_WORK_FACTOR || 12,
      jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
      jwtAuthExpiry: '15m',
      refreshToken: { expiry: '45d', renewRemaining: '15d' }
    },
    development: { jwtSaltWorkFactor: 1, jwtAuthExpiry: '15d' },
    test: {
      jwtSaltWorkFactor: 1,
      jwtAuthExpiry: '5s',
      refreshToken: { expiry: '10s', renewRemaining: '5s' }
    }
  }),
  validation: {
    abortEarly: false,
    convert: false,
    stripUnknown: true,
    presence: 'optional',
    language: { root: 'Value', key: '{{!label}} ' }
  },
  oas: {
    path: './docs/spec.json'
  }
}));
