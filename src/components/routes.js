'use strict';
const router = require('express').Router();

router.use('/auth', require('./auth/auth.routes'));
router.use('/user', require('./user/user.routes'));

module.exports = router;
