const express = require('express');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const config = require('config');
const logger = require('~/utils/logger');

// Get config
const port = config.get('port');
const validation = config.get('validation');

// Initialize Express
const app = express();

// Middleware
app.use(logger.morgan((statusCode) => statusCode >= 400, 'error'));
app.use(logger.morgan((statusCode) => statusCode < 400, 'info'));
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure headers
app.use(compress()); // Gzip compression
app.use(bodyParser.json()); // Parse JSON
app.use(bodyParser.urlencoded({ extended: false })); // Parse urlencoded

// Prepare
require('~/db/connect')(); // Knex & Objection.js database connection
require('~/passport')(app); // Passport
require('request-validation').options({ defaults: validation });

// Routes
const use = require('~/handler')(app);
use.api('/api', require('~/api/routes'));
use.default(); // Default handler for other routes

app.listen(port, () => {
  const env = process.env.NODE_ENV
    ? process.env.NODE_ENV[0].toUpperCase() + process.env.NODE_ENV.slice(1)
    : '';
  logger.info(`${env ? env + ' server' : 'Server'} running on port ${port}`);
});
