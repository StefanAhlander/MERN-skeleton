const path = require('path');
const express = require('express');
const { MongoClient } = require('mongodb');
const template = require('../template');
//comment out before building for production
const compile = require('./devBundle.js');
require('dotenv').config();

const app = express();
//comment out before building for production
compile(app);

const CURRENT_WORKING_DIR = process.cwd();
app.use('/dist', express.static(path.join(CURRENT_WORKING_DIR, 'dist')));

app.get('/', (req, res) => {
  res.status(200).send(template());
});

let port = process.env.PORT || 3000;
app.listen(port, function onStart(err) {
  if (err) {
    console.log(err);
  }
  console.info('Server started on port %s.', port);
});

// Use connect method to connect to the server
MongoClient.connect(
  process.env.DB_CONNECTION_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, db) => {
    if (err) {
      console.error(err);
    } else {
      console.log('Connected successfully to mongodb server');
      db.close();
    }
  }
);
