const morgan = require('morgan');
const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function (app) {
  if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
  }

  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  process.on('unhandledRejection', (e) => { throw e; });
  
  winston.add(winston.transports.File, { filename: 'logfile.log' });
  winston.add(winston.transports.MongoDB, { 
    db: 'mongodb://localhost/login',
    level: 'error' // error warn info verbose debug ...
  });
}