module.exports = {
  logs: {
    morgan: 'dev',
    transports: { console: false, file: false }
  },
  auth: {
    jwtSaltWorkFactor: 1,
    jwtAuthExpiry: '5s',
    refreshToken: { expiry: '10s', renewRemaining: '5s' }
  }
};
