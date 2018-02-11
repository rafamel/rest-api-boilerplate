import { Model, AjvValidator } from 'objection';
import PublicError, { ErrorTypes } from '@/utils/public-error';
import config from '@/config';

class ParentQueryBuilder extends Model.QueryBuilder {
  notNone(label = 'Item') {
    return this.runAfter((res, builder) => {
      const thrower = () => {
        throw new PublicError(`${label} not found.`, {
          type: ErrorTypes.DatabaseNotFound
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

class ParentModel extends Model {
  static QueryBuilder = ParentQueryBuilder;

  static createValidator() {
    return new AjvValidator({
      onCreateAjv: (ajv) => {},
      options: {
        allErrors: false,
        validateSchema: !config.production,
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

export default ParentModel;
