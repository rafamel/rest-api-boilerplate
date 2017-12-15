'use strict';
const router = require('express').Router();
const { PublicError, ErrorTypes } = rootRequire('utils/public-error');
const { authorize } = rootRequire('middlewares/auth');
const validate = require('./user.validation');
const controller = require('./user.controller');

const verifyUser = (req, res, next) => {
    if (req.user.id !== Number(req.params.id)) {
        return next(new PublicError(`You don't have access to this resource`,
            { type: ErrorTypes.Unauthorized }));
    }
    next();
};

// User - /user
router.post('/register', validate.register, controller.register);
router.post('/login', validate.login, controller.login);
router.post('/refresh', validate.refresh, controller.refresh);

router.get('/:id', authorize(), verifyUser, controller.show);
router.patch('/:id', validate.patch, authorize(), verifyUser, controller.patch);
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
