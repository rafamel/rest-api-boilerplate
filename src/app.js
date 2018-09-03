import express from 'express';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import config from 'config';
import logger, { morgan } from '~/utils/logger';

// App specific
import db from '~/db';
import setPassport from '~/passport';
import rv from 'request-validation';
import routes from '~/api/routes';
import handler from '~/handler';

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
db.connect(); // Knex & Objection.js database connection
setPassport(app); // Passport
rv.options({ defaults: validation });

// Routes
const use = handler(app);
use.api('/api', routes);
use.default(); // Default handler for other routes

app.listen(port, () => {
  const env = process.env.NODE_ENV
    ? process.env.NODE_ENV[0].toUpperCase() + process.env.NODE_ENV.slice(1)
    : '';
  logger.info(`${env ? env + ' server' : 'Server'} running on port ${port}`);
});
