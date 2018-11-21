import { PublicError, errors } from 'ponds';
import passport from 'passport';
import User from '~/models/User';

export const role = {
  user: 0,
  editor: 1,
  admin: 2
};

export default function authorize(role = 0) {
  return async (req, res, next) => {
    passport.authenticate(
      'jwt',
      { session: false },
      async (err, user, info) => {
        if (err) {
          return next(
            new PublicError(undefined, {
              info: 'Error retrieving user data.',
              err: err
            })
          );
        }
        const noAccess = () =>
          new PublicError(errors.Unauthorized, {
            info: "You don't have access to this resource.",
            err: info
          });
        if (!user) {
          return info && info.name === 'TokenExpiredError'
            ? next(
                new PublicError(errors.Unauthorized, {
                  info: 'Access Token has expired.',
                  err: info
                })
              )
            : next(noAccess());
        }
        if (role > 0 && (await User.query().findById(user.id)).role !== role) {
          return next(noAccess());
        }

        req.user = user;
        next();
      }
    )(req, res, next);
  };
}
