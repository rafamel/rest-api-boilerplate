# API Boilerplate

[![Version](https://img.shields.io/github/package-json/v/rafamel/rest-api-boilerplate.svg)](https://github.com/rafamel/rest-api-boilerplate) <!-- [![Build Status](https://travis-ci.org/rafamel/rest-api-boilerplate.svg)](https://travis-ci.org/rafamel/rest-api-boilerplate) [![Coverage](https://img.shields.io/coveralls/rafamel/rest-api-boilerplate.svg)](https://coveralls.io/github/rafamel/rest-api-boilerplate) --> [![Dependencies](https://david-dm.org/rafamel/rest-api-boilerplate/status.svg)](https://david-dm.org/rafamel/rest-api-boilerplate) [![License](https://img.shields.io/github/license/rafamel/rest-api-boilerplate.svg)](https://github.com/rafamel/rest-api-boilerplate/blob/master/LICENSE)

**ES2017, Express, Postgress, Objection.js, tokens, and Docker.**

## Stack

* ES2017
* [Express 4](https://expressjs.com/)
* PostgreSQL & [Objection.js](https://github.com/vincit/objection.js) (ORM)
* Token based authentication via [`passport`](http://passportjs.org/) and [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken)
* Tests and coverage with [Jest](https://facebook.github.io/jest/)
* [Docker](https://www.docker.com/) compose/swarm ready

### More greatness

* Validation via [`joi`](https://github.com/hapijs/joi/), [`joi-add`](https://github.com/rafamel/joi-add), and [`request-validation`](https://github.com/rafamel/request-validation)
* [CORS](https://github.com/expressjs/cors) and [Gzip compression](https://github.com/expressjs/compression) enabled
* HTTP headers security via [`helmet`](https://github.com/helmetjs/helmet)
* Logging with [`morgan`](https://github.com/expressjs/morgan)
* Git hooks with [`husky`](https://github.com/typicode/husky)
* Monitoring with [`pm2`](https://github.com/Unitech/pm2)
* Linting via [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/)
* Environment configuration via [`dotenv-safe`](https://github.com/rolodato/dotenv-safe), [`dotenv-cli`](https://github.com/entropitor/dotenv-cli), and [`node-config`](https://github.com/lorenwest/node-config)
* Ad-hoc simple error handling

## Todo

* E2E tests, CI, Docker tests
* Documentation
* Localization
* Docker: deploy
