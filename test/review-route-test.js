'use strict';

const server = require('../server');
const request = require('superagent');
const expect = require('chai').expect;
const User = require('../model/user');
const Review = require('../model/review');
const Movie = require('../model/movie');
require('../server');

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/devMidtermTest';
const url = 'http://localhost:3000';
