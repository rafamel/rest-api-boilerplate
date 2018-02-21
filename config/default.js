const { env, dbUrlPass } = require('~/utils/config-utils');

module.exports = {
  production: env === 'production',
  port: process.env.PORT || 3000,
  logs: 'combined',
  db: {
    client: 'pg',
    connection: dbUrlPass(process.env.DB_URL, process.env.DB_PASS),
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
