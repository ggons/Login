const express = require('express');
const app = express();
const mongoose = require('mongoose');
const users = require('./routes/users');
const auth = require('./routes/auth');
const tests = require('./routes/tests');

mongoose.connect('mongodb://localhost/login', { useNewUrlParser: true })
.then(() => console.log('Connected to MongoDB...'))
.catch(err => console.error('Could not connect to MongoDB...', err));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/tests', tests);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));