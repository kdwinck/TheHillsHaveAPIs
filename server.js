'use strict';

const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/devMidterm';

mongoose.Promise = Promise;//tells mongoose to promisify everything
mongoose.connect(MONGODB_URI);


const server = module.exports = app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});

server.isRunning = true; //setup for testing ability to toggle on/off in before block

module.exports = app;

require('./route/db-routes')(app);
