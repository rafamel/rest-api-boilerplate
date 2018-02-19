const Knex = require('knex');
const { Model } = require('objection');
const config = require('~/config');

module.exports = function dbConnect() {
  const knex = Knex(config.db);
  Model.knex(knex);
};
