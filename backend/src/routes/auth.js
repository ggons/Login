const config = require('config');
const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt-nodejs');
const auth = require('middleware/auth');
const { User } = require('models/user');

/**
 * # 로그인 (email, password)
 */
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send('The user with the given Email was not found.');

  bcrypt.compare(req.body.password, user.password, (err, isEqual) => {
    if (!isEqual) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    req.session[config.get('token')] = token;
    
    res.send(true);
  });
});

/**
 * # 로그인 (token)
 */
router.post('/token', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-_id -password');
  if (!user) {
    req.session = null;
    return res.status(400).send('Invalid token.');
  }
  
  res.send(user);
});

/**
 * # 로그아웃
 */
router.post('/logout', async (req, res) => {
  req.session = null;
  res.send(true);
});

function validate(user) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;