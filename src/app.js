'use strict';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
// Additional useful middleware
// const methodOverride = require('method-override');

const config = require('../config');
const routes = require('./routes');
const error = require('./middlewares/error');

const app = express(); // Initialize Express

app.use(morgan(config.logs)); // Logger
app.use(bodyParser.json()); // JSON parser
app.use(bodyParser.urlencoded({ extended: false })); // Form-urlencoded parser
app.use(compress()); //Gzip compression
app.use(helmet()); // Secure headers
app.use(cors()); // Enable CORS
require('./passport')(app); // Passport

// Routes
app.use('/v1', routes);

// Error handling
app.use(error.notFound);
app.use(error.handler);

app.listen(config.port, () => {
    console.log('App running on port', config.port);
});
