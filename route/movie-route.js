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
  Movie.find({})
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
    .then(movie => movie.calcRating())
    .then(movie => res.json(movie))
    .catch(() => res.json({message: 'movie not found'}));
});

router.get('/movies/:id/reviews', (req, res) => {
  Movie.findById(req.params.id)
    .populate('reviews')
    .then(movie => res.json(movie.reviews));
});
/// auth routes /////////////////////////////////////////////////////////////

router.post('/movies/:id/reviews', jsonParser, bearerAuth, (req, res) => {
  let newReview;
  Movie.findById(req.params.id)
  .then(movie => {
    new Review(req.body).save()
    .then(review => {
      console.log(review);
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

// router.post('/movies/:id/reviews', jsonParser, bearerAuth, (req, res, next) => {
//   let newReview;
//   let reviewMovie;
//   Movie.findById(req.params.id)
//   .then(movie => {
//     reviewMovie = movie;
//     console.log(req.body);
//     return new Review(req.body).save();
//   })
//   .then(reviewForFoundMovie => {
//     newReview = reviewForFoundMovie;
//     req.user.reviews.push(reviewForFoundMovie);
//     return req.user.save();
//   })
//   .then(() => {
//     reviewMovie.reviews.push(newReview);
//     return reviewMovie.save();
//   })
//   .then(() => res.send(newReview))
//   .catch(err => next(err));
// });
