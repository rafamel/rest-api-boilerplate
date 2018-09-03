import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config';
import logger, { morgan } from 'logger';
import ponds from 'ponds';

// App specific
import './ponds'; // Set up ponds
import './db'; // Connect db
import setPassport from './passport';
import rv from 'request-validation';
import routes from './api/routes';

// Get config
const port = config.get('port');
const validation = config.get('validation');

// Initialize Express
const app = express();

// Middleware
app.use(morgan((statusCode) => statusCode >= 400, 'error'));
app.use(morgan((statusCode) => statusCode < 400, 'info'));
app.use(cors()); // Enable CORS
app.use(helmet()); // Secure headers
app.use(compress()); // Gzip compression
app.use(bodyParser.json()); // Parse JSON
app.use(bodyParser.urlencoded({ extended: false })); // Parse urlencoded

// Prepare
setPassport(app); // Passport
rv.options({ defaults: validation });

// Routes
app.use('/api', routes, ponds.get('api'));
app.use(ponds.get('default')); // Default handler for other routes

app.listen(port, () => {
  const env = process.env.NODE_ENV
    ? process.env.NODE_ENV[0].toUpperCase() + process.env.NODE_ENV.slice(1)
    : '';
  logger.info(`${env ? env + ' server' : 'Server'} running on port ${port}`);
});
