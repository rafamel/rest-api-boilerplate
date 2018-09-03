import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from 'config';

const auth = config.get('auth');
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

export default function setPassport(app) {
  app.use(passport.initialize());
  passport.use('jwt', jwt);
}
