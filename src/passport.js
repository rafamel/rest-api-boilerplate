'use strict';
const passport = require('passport');
const User = require('../models/User');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('./config/config');

passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.auth.jwtSecret,
        algorithms: config.auth.jwtAlgorithm,
        json: {
            algorithm: config.auth.jwtAlgorithm,
            maxAge: config.auth.jwtMaxAge
        }
    },
    function(jwt_payload, done) {
        console.log(jwt_payload);
        done(null, null); // return done(null, user); //  return done(err, null);
    }
));

module.exports = null
