const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const config = require('config');

// Initialize Express
const app = express();
// Middleware
app.use(morgan(config.logs)); // Logger
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure headers
app.use(compress()); // Gzip compression
app.use(bodyParser.json()); // Parse JSON
app.use(bodyParser.urlencoded({ extended: false })); // Parse urlencoded

// Prepare
require('~/db/connect')(); // Knex & Objection.js database connection
require('~/passport')(app); // Passport
require('request-validation').options({ defaults: config.get('validation') });

// Routes
const use = require('~/handler')(app);
use.api('/api', require('~/api/routes'));
use.default(); // Default handler for other routes

app.listen(config.get('port'), () => {
  console.log('Server running on port', config.get('port'));
});
