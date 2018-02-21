module.exports = {
  logs: 'dev',
  auth: {
    jwtSaltWorkFactor: 1,
    jwtAuthExpiry: '5s',
    refreshToken: { expiry: '10s', renewRemaining: '5s' }
  }
};
