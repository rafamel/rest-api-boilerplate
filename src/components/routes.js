'use strict';
const router = require('express').Router();

router.use('/auth', require('./auth/auth.routes'));
router.use('/user', require('./user/user.routes'));
router.use('/todo', require('./todo/todo.routes'));

module.exports = router;
