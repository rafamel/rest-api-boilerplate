module.exports = {
  port: 3000,
  logs: 'dev',
  db: {
    debug: true
  },
  auth: {
    jwtSaltWorkFactor: 1,
    jwtAuthExpiry: '15d'
  }
};
