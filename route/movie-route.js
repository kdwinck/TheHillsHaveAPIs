'use strict';
const Movies = require('../model/movie.js');
const jsonParser = require('body-parser').json();

module.exports = (router) => {
  router.get('/movies,', (req, res) => {
    Movies.find({})
    .then(res.json(Movies))
    .catch(res.json({message: 'Not Found'}));
  });
};
