'use strict';
const jwt = require('jsonwebtoken')
const APIError = require('../../utils/api-error.js');
const User = require('./user.model');
const config = require('../../../config');

// Naming: index, show, create, update, destroy

function jwtSignUser(user) {
    user = { user: user };
    return 'JWT ' + jwt.sign(user, config.auth.jwtSecret, {
        algorithm: config.auth.jwtAlgorithm,
        expiresIn: config.auth.jwtMaxAge
    });
}

module.exports = {

    async index(req, res, next) {
        try {
            res.json({
                status: 'success',
                message: 'All users data',
                data: await User.getAll()
            });
        } catch (err) { next(new APIError('Error getting the user.', { err: err })); }
    },

    async show(req, res, next) {
        try {
            const user = await User.getOneBy('username', req.body.username);
            if (!user
                || !(await User.comparePassword(user, req.body.password))) {
                return next(new APIError('Invalid username or password.', { status: 401 }));
            }
            res.json({
                status: 'success',
                message: 'User data',
                data: {
                    user: user,
                    token: jwtSignUser(user)
                }
            });
        } catch (err) { next(new APIError('Error logging in the user.', { err: err })); }
    },

    async create(req, res, next) {
        try {
            res.json({
                status: 'success',
                message: 'User data',
                data: await User.create(req.body)
            });
        } catch (err) { next(new APIError('Error creating the user.', { err: err })); }
    }
};
