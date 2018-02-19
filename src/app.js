import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { options as validationOptions } from 'request-validation';
import dbConnect from '@/db/connect';
import passportConnect from '@/passport';
import routesHandler from '@/handler';
import config from '@/config';

// Initialize Express
const app = express();
// Middleware
app.use(morgan(config.logs)); // Logger
app.use(bodyParser.json()); // Parse JSON
app.use(bodyParser.urlencoded({ extended: false })); // Parse urlencoded
app.use(compress()); // Gzip compression
app.use(helmet()); // Secure headers
app.use(cors()); // Enable CORS

// Prepare
dbConnect(); // Knex & Objection.js database connection
passportConnect(app); // Passport
validationOptions({ defaults: config.validation }); // request joi options

// Routes
const use = routesHandler(app);
use.api('/api', require('@/api/routes'));
use.default(); // Default handler for other routes

app.listen(config.port, () => {
  // eslint-disable-next-line
  console.log('Server running on port', config.port);
});
