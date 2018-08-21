const auth = require('./../middleware/auth');
const admin = require('./../middleware/admin');
const config = require('config');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const { User, validate } = require('./../models/user');

router.get('/', async (req, res) => {
  throw new Error('Could not get the users.');
  const users = await User.find();
  res.send(users);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User({ ...req.body });

  bcrypt.hash(user.password, null, null, async (err, hash) => {
    user.password = hash;
    await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  });
});

router.put('/:email', async (req, res) => {
  const user = User.findById(req.params.id);
  if (!user) return res.status(404).send('The user with the given ID was not found.');
});

router.delete('/:email', [auth, admin], async (req, res) => {
  const user = User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send('The user with the given ID was not found.');
});

module.exports = router;