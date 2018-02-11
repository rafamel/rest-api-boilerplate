import { Router } from 'express';

const router = Router();
router.use('/user', require('./user/user.routes'));
router.use('/todo', require('./todo/todo.routes'));

module.exports = router;
