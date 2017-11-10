'use strict';
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const BearerStrategy = require('passport-http-bearer');
const authProviders = require('./services/authProviders');
// const User = requireAt.model('user');
const config = require('./config');

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

// oAuth
const oAuth = (service) => {
    return async (token, done) => {
        try {
            // eslint-disable-next-line
            const userData = await authProviders[service](token);
            // const user = await User.oAuthLogin(userData); // todo
            // return done(null, user);
            return done(null, null);
        } catch (err) {
            return done(err);
        }
    };
};

module.exports = (app) => {
    app.use(passport.initialize());
    passport.use('jwt', jwt);
    passport.use('facebook', new BearerStrategy(oAuth('facebook')));
    passport.use('google', new BearerStrategy(oAuth('google')));
};
