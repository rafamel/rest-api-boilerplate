'use strict';
const router = require('express').Router();
const validate = require('./middlewares/flowi-request');
const UserController = require('./components/user/user.controller');
const UserValidation = require('./components/user/user.validation');

// Authentication
router.get('/auth', validate(UserValidation.index), UserController.index);
router.post('/auth/login', validate(UserValidation.show), UserController.show);
router.post('/auth/register', validate(UserValidation.create), UserController.create);

/*  // Routes example
    router.get('/api/example', ExampleController.index);
    router.get('/api/example/:id', ExampleController.show);
    router.post('/api/example', ExampleController.create);
    router.put('/api/example/:id', ExampleController.update);
    router.delete('/api/example/:id', ExampleController.destroy);
*/

module.exports = router;
