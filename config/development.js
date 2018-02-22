module.exports = {
  port: 3000,
  logs: {
    morgan: 'dev',
    transports: { console: true, file: true }
  },
  db: { debug: true },
  auth: {
    jwtSaltWorkFactor: 1,
    jwtAuthExpiry: '15d'
  }
};
