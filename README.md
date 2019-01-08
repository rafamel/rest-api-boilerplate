# API Boilerplate

[![License](https://img.shields.io/github/license/rafamel/rest-api-boilerplate.svg)](https://github.com/rafamel/rest-api-boilerplate/blob/master/LICENSE)

<!-- markdownlint-disable MD036 -->
**Express, Postgress, Objection.js, tokens, OpenAPI 3, Babel 7, Docker, and Jest**
<!-- markdownlint-enable MD036 -->

## Stack

* [Express 4](https://expressjs.com/)
* PostgreSQL & [Objection.js](https://github.com/vincit/objection.js) (ORM)
* Token based authentication via [`passport`](http://passportjs.org/) and [`jsonwebtoken`](https://github.com/auth0/node-jsonwebtoken)
* [OpenAPI 3](https://github.com/OAI/OpenAPI-Specification) based validation via [`swagger-express-middleware`](https://github.com/APIDevTools/swagger-express-middleware), testing via [`oas-test`](https://github.com/rafamel/oas-test), and docs generation via [`redoc`](https://github.com/Rebilly/ReDoc) and [`widdershins`](https://github.com/mermade/widdershins)
* Tests and coverage with [Jest](https://facebook.github.io/jest/)
* [Babel 7](https://babeljs.io/) & TypeScript support
* [Docker](https://www.docker.com/) & [CaptainDuckDuck](https://captainduckduck.com) ready
* Develop on MacOS/Linux/Windows

### More greatness

* [CORS](https://github.com/expressjs/cors) and [Gzip compression](https://github.com/expressjs/compression) enabled
* HTTP headers security via [`helmet`](https://github.com/helmetjs/helmet)
* Logging with [`morgan`](https://github.com/expressjs/morgan)
* Git hooks with [`husky`](https://github.com/typicode/husky)
* Monitoring with [`pm2`](https://github.com/Unitech/pm2)
* Linting via [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/)
* Environment configuration via [`dotenv`](https://github.com/motdotla/dotenv) and [`slimconf`](https://github.com/rafamel/slimconf)
* Per-route data and error handling via [`ponds`](https://github.com/rafamel/ponds)

## TODO

* [JSON API](https://jsonapi.org/format/)
* E2E tests, CI
* Documentation
