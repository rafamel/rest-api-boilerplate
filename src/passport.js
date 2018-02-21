const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// const User = requireAt.model('user');
const auth = require('config').get('auth');

// JSONWebTokens
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: auth.jwtSecret,
  algorithms: auth.jwtAlgorithm,
  json: {
    algorithm: auth.jwtAlgorithm,
    maxAge: auth.jwtAuthExpiry
  }
};
const jwt = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  // Todo run user schema validation
  return done(null, jwtPayload.user);
});

module.exports = (app) => {
  app.use(passport.initialize());
  passport.use('jwt', jwt);
};
