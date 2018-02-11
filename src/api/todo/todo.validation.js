import { RequestValidation, ValidationSchema } from 'request-validation';
import Joi from '@/utils/joi';

const schema = new ValidationSchema({
  body: {
    name: Joi.string()
      .addLabel('Todo name')
      .min(1)
      .max(255),
    done: Joi.boolean().options({ convert: true })
  }
});

export default new RequestValidation({
  create: schema.presence('required'),
  update: schema.presence('required'),
  patch: schema
});
