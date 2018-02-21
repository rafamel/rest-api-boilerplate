const Knex = require('knex');
const { Model } = require('objection');
const db = require('config').get('db');

module.exports = function dbConnect() {
  const knex = Knex(db);
  Model.knex(knex);
};
