const express = require('express');
const router = express.Router();
const Joi = require('joi');
const bcrypt = require('bcrypt-nodejs');
const { User } = require('./../models/user');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).send('The user with the given Email was not found.');

  bcrypt.compare(req.body.password, user.password, (err, isEqual) => {
    if (!isEqual) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
    res.send(token);
  });
});

function validate(user) {
  const schema = {
    email: Joi.string().required().email(),
    password: Joi.string().required()
  }

  return Joi.validate(user, schema);
}

module.exports = router;