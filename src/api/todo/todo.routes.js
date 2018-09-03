import route from '~/utils/route';
import authorize from '~/middlewares/authorize';
import validate from './todo.validation';
import controller from './todo.controller';

// Auth - /auth
export default route((router) => {
  router.get('/', authorize(), controller.index);
  router.get('/:id', authorize(), controller.show);
  router.post('/', validate.create, authorize(), controller.create);
  router.put('/:id', validate.update, authorize(), controller.update);
  router.patch('/:id', validate.patch, authorize(), controller.patch);
  router.delete('/:id', authorize(), controller.delete);
});

/*  // Routes example
    router.get('/api/example', ExampleController.index);
    router.get('/api/example/:id', ExampleController.show);
    router.post('/api/example', ExampleController.create);
    router.put('/api/example/:id', ExampleController.update);
    router.patch('/api/example/:id', ExampleController.patch);
    router.delete('/api/example/:id', ExampleController.delete);
*/
