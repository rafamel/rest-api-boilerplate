import objection from 'objection';
import Knex from 'knex';
import config from '@/config';

export default function dbConnect() {
  const Model = objection.Model;
  const knex = Knex(config.db);
  Model.knex(knex);
}
