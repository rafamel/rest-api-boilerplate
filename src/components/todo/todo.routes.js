'use strict';
const router = require('express').Router();
const { KeyFlow } = require('flowi');
const fwr = rootRequire('middlewares/flowi-request');
const { authorize } = rootRequire('middlewares/auth');
const controller = require('./todo.controller');
const Todo = require('./todo.model');
const reqSchema = Todo.reqSchema;

const validate = {
    createUpdate: {
        body: KeyFlow(reqSchema).require(['name'])
    },
    patch: {
        body: KeyFlow(reqSchema)
            .require(true, 1)
    }
};

// Auth - /auth
router.get('/', authorize(), controller.index);
router.get('/:id', authorize(), controller.show);
router.post('/', fwr(validate.createUpdate), authorize(), controller.create);
router.put('/:id', fwr(validate.createUpdate), authorize(), controller.update);
router.patch('/:id', fwr(validate.patch), authorize(), controller.patch);
router.delete('/:id', authorize(), controller.delete);

module.exports = router;

/*  // Routes example
    router.get('/api/example', ExampleController.index);
    router.get('/api/example/:id', ExampleController.show);
    router.post('/api/example', ExampleController.create);
    router.put('/api/example/:id', ExampleController.update);
    router.patch('/api/example/:id', ExampleController.patch);
    router.delete('/api/example/:id', ExampleController.delete);
*/
