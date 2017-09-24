'use strict';
const User = require('../models/User');

// Naming: index, show, create, update, destroy

module.exports = {

    async index(req, res, next) {
        try {
            res.json({
                status: 'success',
                message: 'All users data',
                data: await User.getAll()
            });
        } catch (err) { next(Error.thrower({ public: 'Error getting the user.' }, err)); }
    },

    async show(req, res, next) {
        try {
            const user = await User.getOneBy('username', req.body.username);
            if (!user
                || !(await User.comparePassword(user, req.body.password))) {
                return next(Error.thrower({ public: 'Invalid username or password.', status: 401 }));
            }
            res.json({
                status: 'success',
                message: 'User data',
                data: user
            });
        } catch (err) { next(Error.thrower({ public: 'Error logging in the user.' }, err)); }
    },

    async create(req, res, next) {
        try {
            res.json({
                status: 'success',
                message: 'User data',
                data: await User.create(req.body)
            });
        } catch (err) { next(Error.thrower({ public: 'Error creating the user.' }, err)); }
    }
};
