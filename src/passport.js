'use strict';
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const BearerStrategy = require('passport-http-bearer');
const authProviders = require('./services/authProviders');
const User = require('./components/user/user.model');
const config = require('../config');

// JSONWebTokens
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('JWT'),
    secretOrKey: config.auth.jwtSecret,
    algorithms: config.auth.jwtAlgorithm,
    json: {
        algorithm: config.auth.jwtAlgorithm,
        maxAge: config.auth.jwtMaxAge
    }
};
const jwt = new JwtStrategy(jwtOptions, async function(jwtPayload, done) {
    // try {
    //     const user = await User.getOneBy('id', jwtPayload.user.id);
    //     if (!user) return done(new Error(), null);
    //     return done(null, user);
    // } catch (err) { return done(err, null); }
    return done(null, jwtPayload.user);
});

// oAuth
const oAuth = function(service) {
    return async (token, done) => {
        try {
            const userData = await authProviders[service](token);
            // const user = await User.oAuthLogin(userData); // todo
            // return done(null, user);
            return done(null, null);
        } catch (err) {
            return done(err);
        }
    };
};

module.exports = function(app) {
    app.use(passport.initialize());
    passport.use('jwt', jwt);
    passport.use('facebook', new BearerStrategy(oAuth('facebook')));
    passport.use('google', new BearerStrategy(oAuth('google')));
};

  exports.jwt = new JwtStrategy(jwtOptions, jwt);
  exports.facebook = new BearerStrategy(oAuth('facebook'));
  exports.google = new BearerStrategy(oAuth('google'));
