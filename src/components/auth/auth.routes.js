'use strict';
const router = require('express').Router();
const { KeyFlow } = require('flowi');
const fwr = rootRequire('middlewares/flowi-request');
const controller = require('./auth.controller');
const authReqSchema = require('./auth.model').reqSchema;
const userReqSchema = require('../user/user.model').reqSchema;

const validate = {
    register: {
        body: KeyFlow(userReqSchema).require()
    },
    login: {
        body: KeyFlow(userReqSchema).use(['username', 'password']).require()
    },
    refresh: {
        body: KeyFlow(authReqSchema).require()
    }
};

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
    router.patch('/api/example/:id', ExampleController.patch);
    router.delete('/api/example/:id', ExampleController.delete);
*/
