'use strict';

const objection = require('objection');
const Model = objection.Model;
const Knex = require('knex');
const knexConfig = require('../../knexfile');
const knex = Knex(knexConfig.development);
Model.knex(knex);
