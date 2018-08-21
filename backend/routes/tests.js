const express = require('express');
const router = express.Router();
const auth = require('./../middleware/auth');
const admin = require('./../middleware/admin');

router.get('/', auth, (req, res) => {
  res.send('success');
});

router.delete('/:id', [auth, admin], (req, res) => {
  res.send('success');
});

module.exports = router;