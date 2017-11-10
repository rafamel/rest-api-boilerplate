'use strict';
const router = require('express').Router();
const fwr = rootRequire('middlewares/flowi-request');
const validate = require('./auth.validate');
const controller = require('./auth.controller');

// Auth - /auth
router.post('/register', fwr(validate.register), controller.register);
router.post('/login', fwr(validate.login), controller.login);
router.post('/refresh', fwr(validate.refresh), controller.refresh);

module.exports = router;

/*  // Routes example
    router.get('/api/example', ExampleController.index);
    router.get('/api/example/:id', ExampleController.show);
    router.post('/api/example', ExampleController.create);
    router.put('/api/example/:id', ExampleController.update);
    router.delete('/api/example/:id', ExampleController.destroy);
*/
