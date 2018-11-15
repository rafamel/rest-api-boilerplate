import { dispatch } from 'ponds';
import Todo from '~/models/Todo';

// index, show, create, update, patch, delete
export default dispatch.all({
  async index(req) {
    return Todo.query().where('user_id', req.user.id);
  },
  async show(req) {
    return Todo.query()
      .findById(req.params.id)
      .notNone()
      .then((m) => m.assertOwner(req.user));
  },
  async create(req) {
    req.body.user_id = req.user.id;
    return Todo.query().insert(req.body);
  },
  async update(req) {
    req.body.user_id = req.user.id;
    return Todo.query()
      .findById(req.params.id)
      .notNone()
      .then((m) =>
        m
          .assertOwner(req.user)
          .$query()
          .update(req.body)
          .returning('*')
      );
  },
  async patch(req) {
    return Todo.query()
      .findById(req.params.id)
      .notNone()
      .then((m) =>
        m
          .assertOwner(req.user)
          .$query()
          .patch(req.body)
          .returning('*')
      );
  },
  async delete(req) {
    return Todo.query()
      .findById(req.params.id)
      .notNone()
      .then((m) =>
        m
          .assertOwner(req.user)
          .$query()
          .delete()
          .runAfter((x) => x === 1)
      );
  }
});
