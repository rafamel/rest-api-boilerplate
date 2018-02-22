const morgan = require('morgan');
const winston = require('winston');
const moment = require('moment');
const config = require('config');

const logs = config.get('logs');
const production = config.get('production');

const transports = {
  console: new winston.transports.Console({
    level: logs.levels.console,
    colorize: !production,
    timestamp: production ? () => new Date().toISOString() : null,
    handleExceptions: true,
    humanReadableUnhandledException: true
  }),
  file: new winston.transports.File({
    level: logs.levels.file,
    filename: `./logs/${moment().format('YYYY-MM-DD')}.log`,
    colorize: !production,
    timestamp: () => new Date().toISOString(),
    handleExceptions: true,
    humanReadableUnhandledException: true
  })
};

const logger = new winston.Logger({
  transports: Object.keys(transports)
    .filter((key) => logs.transports[key])
    .reduce((acc, key) => acc.concat(transports[key]), []),
  exitOnError: false
});

const morganLogger = (on, level) => {
  return morgan(logs.morgan, {
    skip: (req, res) => !on(res.statusCode),
    stream: { write: (message) => logger[level](message) }
  });
};

module.exports = logger;
module.exports.morgan = morganLogger;
