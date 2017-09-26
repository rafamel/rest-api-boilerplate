'use strict';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
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

// app.use(passport.initialize());
// passport.use('jwt', strategies.jwt);
// passport.use('facebook', strategies.facebook);
// passport.use('google', strategies.google);

// Routes
app.use('/v1', routes);

// Error handling
app.use(error.notFound);
app.use(error.handler);

app.listen(config.port, () => {
    console.log('App running on port', config.port);
});
