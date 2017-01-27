'use strict';

const jsonParser = require('body-parser').json();
const Router = require('express').Router;
const createError = require('http-errors');

const Movie = require('../model/movie.js');
const User = require('../model/user');
const Review = require('../model/review');

const bearerAuth = require('../lib/bearer-auth-middleware');

let router = module.exports = new Router();

/// unauthorized routes /////////////////////////////////////////////////////

router.get('/movies', (req, res) => {
  Movie.find({})
    .then(movies => res.json(movies))
    .catch(() => res.status(404).send('not found'));
});

router.get('/movies/:id', (req, res) => {
  Movie.findById(req.params.id)
    .populate('reviews')
    .then(movie => movie.calcRating())
    .then(movie => res.json(movie))
    .catch(() => res.status(404).send('movie not found'));
});

router.get('/movies/title/:title', (req, res) => {
  Movie.findOne({ original_title: req.params.title})
    .then(movie => movie.calcRating())
    .then(movie => res.json(movie))
    .catch(() => res.status(404).send('movie not found'));
});

router.get('/movies/:id/reviews', (req, res) => {
  Movie.findById(req.params.id)
    .populate('reviews')
    .then(movie => res.json(movie.reviews))
    .catch(() => res.status(404).send('movie not found'));
});

/// auth routes /////////////////////////////////////////////////////////////

router.post('/movies/:id/reviews', jsonParser, bearerAuth, (req, res, next) => {
  let newReview;
  let testMovie;
  Movie.findById(req.params.id)
    .then(movie => {
      testMovie = movie;
      return new Review(req.body).save();
    })
    .then(review => {
      newReview = review;
      req.user.reviews.push(newReview);
      return req.user.save();
    })
    .then(() => {
      testMovie.reviews.push(newReview);
      testMovie.save();
    })
    .then(() => res.json(newReview))
    .catch(() => {
      next(createError(404, 'movie not found'));
    });
});

router.get('/favorites', bearerAuth, (req, res) => {
  User.findById(req.user._id)
    .populate('favMovies')
    .then(user => {
      if (user.favMovies.length) {
        res.json(user.favMovies);
      } else {
        res.status(404).send('no fav movies');
      }
    })
    .catch(() => res.status(400).send('bad request'));
});

router.get('/movies/:id/add', bearerAuth, (req, res) => {
  Movie.findById(req.params.id)
    .then(movie => {
      req.user.favMovies.push(movie);
      return req.user.save();
    })
    .then(() =>  {
      return User.findById(req.user._id)
      .populate('favMovies', 'original_title');
    })
    .then(user => res.json(user))
    .catch(() => res.status(400).send('bad request'));
});

router.delete('/movies/:id/delete', bearerAuth, (req, res) => {
  let movieIndex = req.user.favMovies.indexOf(req.params.id);
  req.user.favMovies.splice(movieIndex, 1);
  req.user.save()
    .then(() => res.json(req.user.favMovies))
    .catch(() => res.status(400).send('bad request'));
});
