'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;

const Movie = require('../model/movie.js');
// const User = require('../model/user');
const Review = require('../model/review');

const bearerAuth = require('../lib/bearer-auth-middleware');

let router = module.exports = new Router();

/// unauthorized routes /////////////////////////////////////////////////////

router.get('/movies', (req, res) => {
  Movie.find({}).limit(10)
    .then(movies => res.json(movies))
    .catch(() => res.json('not found'));
});

router.get('/movies/:id', (req, res) => {
  Movie.findById(req.params.id)
    .populate('reviews')
    .then(movie => movie.calcRating())
    .then(movie => res.json(movie))
    .catch((e) => res.json({err: e}));
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
      req.user.save()
        .then(() => {
          movie.reviews.push(review);
          movie.save();
        });
    })
    .then(() => res.json(newReview))
    .catch(() => res.status(400).send('bad request'));
  });
});
