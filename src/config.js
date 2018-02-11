import randtoken from 'rand-token';
import { env, onEnv } from '@/utils/config-utils';

export default {
  production: env === 'production',
  port:
    process.env.PORT ||
    onEnv({
      default: 3000,
      production: 80
    }),
  logs: onEnv({
    default: 'dev',
    production: 'combined'
  }),
  db: {
    client: 'pg',
    connection: onEnv({
      default: process.env.DB_URL,
      test: process.env.DB_TEST_URL
    }),
    pool: { min: 2, max: 10 },
    debug: onEnv({
      default: false,
      development: true
    }),
    migrations: { directory: './src/db/migrations' },
    seeds: { directory: './src/db/seeds' }
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || randtoken.generate(40),
    jwtSaltWorkFactor:
      process.env.JWT_SALT_WORK_FACTOR ||
      onEnv({
        default: 12,
        development: 1
      }),
    jwtAlgorithm: process.env.JWT_ALGORITHM || 'HS256',
    jwtAuthExpiry: onEnv({
      default: '15m',
      development: '15d',
      test: '5s'
    }),
    refreshToken: onEnv({
      default: { expiry: '45d', renewRemaining: '15d' },
      test: { expity: '10s', renewRemaining: '5s' }
    })
  },
  joi: {
    abortEarly: true,
    convert: false,
    stripUnknown: true,
    presence: 'optional',
    language: {
      root: 'Value',
      key: '{{!label}} '
    }
  }
};
