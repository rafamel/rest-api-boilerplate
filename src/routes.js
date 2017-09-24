'use strict';
const router = require('express').Router();
const UserController = require('./controllers/UserController');

// Authentication
router.get('/auth', UserController.index);
router.post('/auth/login', UserController.show);
router.post('/auth/register', UserController.create);

/*  // Routes example
    router.get('/api/example', ExampleController.index);
    router.get('/api/example/:id', ExampleController.show);
    router.post('/api/example', ExampleController.create);
    router.put('/api/example/:id', ExampleController.update);
    router.delete('/api/example/:id', ExampleController.destroy);
*/

module.exports = router;
