'use strict';

const Router = require('express').Router;
const Movies = require('../model/movie.js');
const User = require('../model/user');
const jsonParser = require('body-parser').json();

let router = module.exports = new Router();

router.get('/movies,', (req, res) => {
  Movies.find({})
  .then(res.json(Movies))
  .catch(res.json({message: 'Not Found'}));
});
