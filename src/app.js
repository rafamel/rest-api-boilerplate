import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import logger, { morgan } from 'logger';
import passport from 'passport';

// App specific
import './ponds'; // Set up ponds
import './db'; // Connect db
import rv from 'request-validation';
import jwt from './jwt';
import routes from './routes';
import config from './config';

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
rv.options({ defaults: validation });
app.use(passport.initialize());
passport.use('jwt', jwt);

// Routes
app.use(routes);

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});
