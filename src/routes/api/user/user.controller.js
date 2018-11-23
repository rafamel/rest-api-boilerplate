import { dispatch, PublicError, errors } from 'ponds';
import Auth from '~/models/Auth';
import User from '~/models/User';

// index, show, create, update, patch, delete
export default dispatch.all({
  async login(req) {
    const user = await User.query()
      .first()
      .where('username', req.body.username);

    // eslint-disable-next-line prettier/prettier
    if (!user || !(await user.isPassword(req.body.password))) {
      throw new PublicError(errors.Unauthorized, {
        info: 'Invalid username or password'
      });
    }

    const refreshToken = await Auth.method.create(user);
    return {
      user: user,
      token: await refreshToken.newAccessToken(user)
    };
  },

  async register(req) {
    const user = await User.query()
      .insert(req.body)
      .returning('*');
    const refreshToken = await Auth.method.create(user);
    return {
      user: user,
      token: await refreshToken.newAccessToken(user)
    };
  },

  async refresh(req) {
    const user = await User.query()
      .findById(req.body.userId)
      .notNone();
    const refreshToken = await Auth.method.get(req.body.refreshToken);
    return refreshToken.newAccessToken(user);
  },

  async show(req) {
    return User.query()
      .findById(req.params.id)
      .notNone();
  },

  async patch(req) {
    return User.query()
      .findById(req.params.id)
      .notNone()
      .then((m) =>
        m
          .$query()
          .patch(req.body)
          .returning('*')
      );
  },
  async delete(req) {
    return User.query()
      .findById(req.params.id)
      .notNone()
      .then((m) =>
        m
          .$query()
          .delete()
          .runAfter((x) => x === 1)
      );
  }
});
