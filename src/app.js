'use strict';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');

// Additional useful middleware
// const methodOverride = require('method-override');
// const RateLimit = require('express-rate-limit');

// TODO: passport with OAuth2, sequelize, user
// component / remove / update user, refresh token to id+refresh

// requireAt, config
require('./utils/rootRequire')(__dirname);
const config = require('./config');

// Initialize Express
const app = express();
// Database connection
require('./db/connect');

// Middleware
app.use(morgan(config.logs)); // Logger
app.use(bodyParser.json()); // JSON parser
app.use(bodyParser.urlencoded({ extended: false })); // Form-urlencoded parser
app.use(compress()); // Gzip compression
app.use(helmet()); // Secure headers
require('./passport')(app); // Passport
app.use(cors()); // Enable CORS

// Handler for routes
const use = require('./handler')(app);
use.api('/v1', require('./components/routes'));

// Default handler (for other routes)
use.default();

app.listen(config.port, () => {
    console.log('Server running on port', config.port);
});
