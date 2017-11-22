'use strict';
const router = require('express').Router();
const validate = require('./auth.validation');
const controller = require('./auth.controller');

// Auth - /auth
router.post('/register', validate.register, controller.register);
router.post('/login', validate.login, controller.login);
router.post('/refresh', validate.refresh, controller.refresh);

module.exports = router;

/*  // Routes example
    router.get('/api/example', ExampleController.index);
    router.get('/api/example/:id', ExampleController.show);
    router.post('/api/example', ExampleController.create);
    router.put('/api/example/:id', ExampleController.update);
    router.patch('/api/example/:id', ExampleController.patch);
    router.delete('/api/example/:id', ExampleController.delete);
*/
