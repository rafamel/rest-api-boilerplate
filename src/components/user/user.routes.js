'use strict';
const router = require('express').Router();
const authorize = rootRequire('middlewares/auth').authorize;
const { dispatch } = rootRequire('middlewares/dispatch');
const controller = require('./user.controller');
const User = require('./user.model');

// User - /user
router.get('/', dispatch(async () => (await User.query().first()).$relatedQuery('refreshTokens')));
router.get('/:id', authorize, controller.show);

module.exports = router;

/*  // Routes example
    router.get('/api/example', ExampleController.index);
    router.get('/api/example/:id', ExampleController.show);
    router.post('/api/example', ExampleController.create);
    router.put('/api/example/:id', ExampleController.update);
    router.delete('/api/example/:id', ExampleController.destroy);
*/
