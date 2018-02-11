import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import config from '@/config';

// JSONWebTokens
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: config.auth.jwtSecret,
  algorithms: config.auth.jwtAlgorithm,
  json: {
    algorithm: config.auth.jwtAlgorithm,
    maxAge: config.auth.jwtAuthExpiry
  }
};
const jwt = new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
  // Todo run user schema validation
  return done(null, jwtPayload.user);
});

export default (app) => {
  app.use(passport.initialize());
  passport.use('jwt', jwt);
};
