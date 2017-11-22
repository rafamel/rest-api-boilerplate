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

// TODO: passport with OAuth2

// rootRequire, config
require('./utils/root-require')(__dirname);
const config = require('./config');

// Initialize Express
const app = express();
// Database connection
require('./db/connect');

// Middleware
app.use(morgan(config.logs)); // Logger
if (config.parse.json) {
    // JSON parser
    app.use(bodyParser.json());
}
if (config.parse.urlencoded) {
    // Form-urlencoded parser
    app.use(bodyParser.urlencoded({ extended: false }));
}
app.use(compress()); // Gzip compression
app.use(helmet()); // Secure headers
require('./passport')(app); // Passport
app.use(cors()); // Enable CORS

// Handler for routes
const use = require('./handler')(app);
// API handler for API routes
use.api('/v1', require('./components/routes'));
// Default handler for other routes
use.default();

app.listen(config.port, () => {
    console.log('Server running on port', config.port);
});
