import { Model, AjvValidator } from 'objection';
import { PublicError, ErrorTypes } from 'ponds';
import config from 'config';

const production = config.get('production');
class ParentQueryBuilder extends Model.QueryBuilder {
  notNone(label = 'Item') {
    return this.runAfter((res, builder) => {
      const thrower = () => {
        throw new PublicError(ErrorTypes.DatabaseNotFound, {
          info: `${label} not found.`
        });
      };
      if (Array.isArray(res)) {
        if (res.length === 0) return thrower();
      } else if (res === null || res === undefined || res === 0) {
        return thrower();
      }
      return res;
    });
  }
}

export default class ParentModel extends Model {
  static QueryBuilder = ParentQueryBuilder;

  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {},
      options: {
        allErrors: false,
        validateSchema: !production,
        ownProperties: true,
        v5: true
      }
    });
  }

  $beforeInsert(...args) {
    const parent = super.$beforeInsert(...args);
    return Promise.resolve(parent).then(() => {
      this.created_at = new Date().toISOString();
    });
  }

  $beforeUpdate(...args) {
    const parent = super.$beforeUpdate(...args);
    return Promise.resolve(parent).then(() => {
      this.updated_at = new Date().toISOString();
    });
  }
}
