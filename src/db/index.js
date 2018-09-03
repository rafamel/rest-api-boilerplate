import Knex from 'knex';
import { Model } from 'objection';
import config from 'config';

const db = config.get('db');
export default {
  config: db,
  connect() {
    const knex = Knex(db);
    Model.knex(knex);
  }
};
