const config = require('config');
const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function () {
  mongoose.connect(`mongodb://${config.get('db')}`, { useNewUrlParser: true })
    .then(() => winston.info('Connected to MongoDB...'));
    // .catch(err => console.error('Could not connect to MongoDB...', err));
}