import Joi from '~/utils/joi';
import { RequestValidation, ValidationSchema } from 'request-validation';

const schema = new ValidationSchema({
  body: {
    name: Joi.string()
      .min(1)
      .max(255)
      .addLabel('Todo name'),
    done: Joi.boolean().options({ convert: true })
  }
});

module.exports = new RequestValidation({
  create: schema.presence('required'),
  update: schema.presence('required'),
  patch: schema
});
