const config = require('config');
const express = require('express');
const session = require('cookie-session');
const users = require('routes/users');
const auth = require('routes/auth');
const error = require('middleware/error');

module.exports = function (app) {
  app.use(express.json());
  app.use(session({
      name: config.get('session'),
      keys: [...config.get('cookieSeeionKey')],
      cookie: { 
        secure: true,
        httpOnly: true
      }
    })
  );
  app.use(express.static('public'));
  app.use('/api/users', users);
  app.use('/api/auth', auth);
  app.use(error);
}