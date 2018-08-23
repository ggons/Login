const auth = require('middleware/auth');
const admin = require('middleware/admin');
const config = require('config');
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const { User, validate } = require('models/user');

/**
 * # 유저 정보 (email)
 */
router.get('/', async (req, res) => {
  const users = await User.find().select('email');
  res.send(users);
});

/**
 * # 유저 정보 (로그인 상태)
 */
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

/**
 * # 회원가입 (자동 로그인 X)
 */
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User({ ...req.body });

  bcrypt.hash(user.password, null, null, async (err, hash) => {
    user.password = hash;
    await user.save();

    res.send(_.pick(user, ['_id', 'name', 'email']));
    // const token = user.generateAuthToken();
    // res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  });
});

/**
 * 미구현
 */
router.put('/:email', async (req, res) => {
  const user = User.findOne({ email: req.params.email });
  if (!user) return res.status(404).send('The user with the given Email was not found.');
});

/**
 * 미구현
 */
router.delete('/:email', [auth, admin], async (req, res) => {
  const user = User.findOne({ email: req.params.email });
  if (!user) return res.status(404).send('The user with the given Email was not found.');
});

module.exports = router;