import { PublicError, ErrorTypes } from 'ponds';
import passport from 'passport';
import User from '~/api/user/user.model';

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
            new PublicError(null, {
              info: 'Error retrieving user data.',
              err: err
            })
          );
        }
        const noAccess = () =>
          new PublicError(ErrorTypes.Unauthorized, {
            info: "You don't have access to this resource.",
            err: info
          });
        if (!user) {
          return info && info.name === 'TokenExpiredError'
            ? next(
                new PublicError(ErrorTypes.Unauthorized, {
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
