import route from 'route';
import ponds from 'ponds';
import api from './api';

export default route((router) => {
  router.use('/api', api, ponds.get('api'));
  router.use(ponds.get('default')); // Default handler for other
});
