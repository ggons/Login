const express = require('express');
const users = require('../routes/users');
const tests = require('../routes/tests');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/users', users);
  app.use('/api/tests', tests);
  app.use('/api/auth', auth);
  app.use(error);
}