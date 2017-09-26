'use strict';
const PublicError = require('../../utils/public-error.js');
const User = require('./user.model');

// Naming: index, show, create, update, destroy

module.exports = {

    async index(req, res, next) {
        try {
            res.json({
                status: 'success',
                message: 'All users data',
                data: await User.getAll()
            });
        } catch (err) { next(new PublicError('Error getting the user.', { err: err })); }
    },

    async show(req, res, next) {
        try {
            const user = await User.getOneBy('username', req.body.username);
            if (!user
                || !(await User.comparePassword(user, req.body.password))) {
                return next(new PublicError('Invalid username or password.', { status: 401 }));
            }
            res.json({
                status: 'success',
                message: 'User data',
                data: user
            });
        } catch (err) { next(new PublicError('Error logging in the user.', { err: err })); }
    },

    async create(req, res, next) {
        try {
            res.json({
                status: 'success',
                message: 'User data',
                data: await User.create(req.body)
            });
        } catch (err) { next(new PublicError('Error creating the user.', { err: err })); }
    }
};
