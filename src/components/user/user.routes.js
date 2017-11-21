'use strict';
const router = require('express').Router();
const { APIError, ErrorTypes } = rootRequire('utils/api-error');
const { KeyFlow } = require('flowi');
const fwr = rootRequire('middlewares/flowi-request');
const { authorize } = rootRequire('middlewares/auth');
const controller = require('./user.controller');
const reqSchema = require('../user/user.model').reqSchema;

const verifyUser = (req, res, next) => {
    if (req.user.id !== Number(req.params.id)) {
        return next(new APIError(`You don't have access to this resource`,
            { type: ErrorTypes.Unauthorized }));
    }
    next();
};

const validate = {
    patch: {
        body: KeyFlow(reqSchema).require(true, 1)
    }
};

// User - /user
router.get('/:id', authorize(), verifyUser, controller.show);
router.patch('/:id', fwr(validate.patch), authorize(), verifyUser, controller.patch);
router.delete('/:id', authorize(), verifyUser, controller.delete);

module.exports = router;

/*  // Routes example
    router.get('/api/example', ExampleController.index);
    router.get('/api/example/:id', ExampleController.show);
    router.post('/api/example', ExampleController.create);
    router.put('/api/example/:id', ExampleController.update);
    router.patch('/api/example/:id', ExampleController.patch);
    router.delete('/api/example/:id', ExampleController.delete);
*/
