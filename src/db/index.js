import Knex from 'knex';
import { Model } from 'objection';
import config from '~/config';

const db = config.get('db');
const knex = Knex(db);
Model.knex(knex);

export default knex;
