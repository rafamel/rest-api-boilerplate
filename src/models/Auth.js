import path from 'path';
import Model from '~/db/Model';
import { PublicError, errors } from 'ponds';
import ms from 'ms';
import moment from 'moment';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import config from '~/config';

const auth = config.get('auth');
export default class RefreshToken extends Model {
  // Table Name
  static tableName = 'refresh_token';

  // Database Schema validation
  static jsonSchema = {
    type: 'object',
    required: ['token', 'expires', 'user_id'],
    properties: {
      id: { type: 'integer' },
      token: { type: 'string', minLength: 1, maxLength: 255 },
      expires: { type: 'string' },
      user_id: { type: 'integer' }
    }
  };

  // Associations
  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: path.join(__dirname, 'User'),
      join: {
        from: 'refresh_token.user_id',
        to: 'users.id'
      }
    }
  };

  // Class Methods
  static get method() {
    return {
      create: async (user) => {
        // A new refresh token must be issued
        const newRefreshToken = {
          user_id: user.id,
          token: `${crypto.randomBytes(40).toString('hex')}`,
          expires: String(
            moment()
              .add(ms(auth.refreshToken.expiry), 'ms')
              .toISOString()
          )
        };
        return this.query()
          .insert(newRefreshToken)
          .returning('*');
      },
      get: async (fullToken) => {
        const [id, token] = fullToken.split('.');
        const dbToken = await this.query().findById(id);
        if (!dbToken || dbToken.token !== token) {
          throw new PublicError(errors.Unauthorized);
        }
        return dbToken;
      }
    };
  }

  // Instance Methods
  get fullToken() {
    return `${this.id}.${this.token}`;
  }

  async runChecks(user) {
    // Check user id
    if (!user || this.user_id !== user.id) {
      throw new PublicError(errors.Unauthorized, { info: 'Invalid token' });
    }

    // Check expiration
    const expiry = moment(this.expires);
    const currentUnix = moment().unix();
    if (currentUnix > expiry.unix()) {
      throw new PublicError(errors.Unauthorized, { info: 'Invalid token' });
    }

    // Create new refreshToken if needed
    const remaining = expiry.subtract(
      ms(auth.refreshToken.renewRemaining),
      'ms'
    );
    if (currentUnix >= remaining.unix()) {
      await this.$query().delete();
      const refreshToken = await this.constructor.method.create(user);
      return refreshToken.fullToken;
    }
    return this.fullToken;
  }

  async newAccessToken(user) {
    function generateAccessToken() {
      const payload = {
        iat: moment().unix(),
        user: user
      };
      return jwt.sign(payload, auth.jwtSecret, {
        algorithm: auth.jwtAlgorithm,
        expiresIn: auth.jwtAuthExpiry
      });
    }
    // Check refresh token
    const fullToken = await this.runChecks(user);

    return {
      token_type: 'bearer',
      access_token: generateAccessToken(),
      refresh_token: fullToken,
      expires_in: ms(auth.jwtAuthExpiry)
    };
  }
}
