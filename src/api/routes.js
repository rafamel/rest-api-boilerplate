import route from '~/utils/route';
import user from './user';
import todo from './todo';

export default route((router) => {
  router.use('/user', user.routes);
  router.use('/todo', todo.routes);
});
