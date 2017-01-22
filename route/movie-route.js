'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;

const Movie = require('../model/movie.js');
const User = require('../model/user');
const Review = require('../model/review');

const basicAuth = require('../lib/basic-auth-middleware');
const bearerAuth = require('../lib/bearer-auth-middleware');

let router = module.exports = new Router();

/// unauthorized routes /////////////////////////////////////////////////////

router.get('/movies', (req, res) => {
  console.log('in /movies');
  Movie.find({}).limit(10)
    .then(movies => res.json(movies))
    .catch(() => res.json('not found'));
});

router.get('/movies/:id', (req, res) => {
  Movie.findById(req.params.id)
    .then(movie => res.json(movie))
    .catch(() => res.json({message: 'not found'}));
});

router.get('/movies/title/:title', (req, res) => {
  Movie.findOne({ original_title: req.params.title})
    .then(movie => res.json(movie))
    .catch(() => res.json({message: 'movie not found'}));
});

/// auth routes /////////////////////////////////////////////////////////////

router.post('/movies/:id/reviews', jsonParser, bearerAuth, (req, res) => {
  let newReview;
  Movie.findById(req.params.id)
  .then(movie => {
    new Review(req.body).save()
    .then(review => {
      newReview = review;
      req.user.reviews.push(review);
      req.user.save();
      movie.reviews.push(review);
      movie.updateRating();
      movie.save();
    })
    .then(() => res.json(newReview))
    .catch(() => res.stats(400).send('bad request'));
  });
});
