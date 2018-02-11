import { RequestValidation, ValidationSchema } from 'request-validation';
import Joi from '@/utils/joi';

const schema = new ValidationSchema({
  body: {
    username: Joi.string()
      .addLabel('Username')
      .add(
        (it) => it.min(6).max(16),
        'Username should have a length of 6 to 16 characters.'
      )
      .add(
        (it) => it.regex(/^[a-zA-Z0-9_]+$/),
        'Username should only contain letters, numbers, and underscores (_).'
      ),
    password: Joi.string()
      .addLabel('Password')
      .add(
        (it) => it.min(8).max(20),
        'Password should have a length of 8 to 20 characters.'
      )
      .add(
        (it) => it.regex(/^[a-zA-Z0-9_]+$/),
        'Password should only contain letters, numbers, and underscores (_).'
      )
      .add(
        (it) => it.regex(/[a-zA-Z]/),
        'Password should contain some letters.'
      ),
    email: Joi.string()
      .addLabel('Email')
      .email()
  }
});

export default new RequestValidation({
  register: schema
    .useBody('username', 'password', 'email')
    .presence('required'),
  login: schema.useBody('username', 'password').presence('required'),
  patch: schema
    .useBody('username', 'password', 'email')
    .forbidden({ body: 'username' }),
  refresh: new ValidationSchema({
    body: {
      userId: Joi.number()
        .integer()
        .positive()
        .options({ convert: true }),
      refreshToken: Joi.string()
    }
  }).presence('required')
});
