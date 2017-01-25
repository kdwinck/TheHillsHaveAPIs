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
    .po-pulate('reviews')
    .then(movie => res.json(movie.reviews))
    .catch((e) => res.json(e));
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

router.get('/favorites', bearerAuth, (req, res) => {
  console.log(req.User);
  if(req.user.favMovies.length) res.send(req.user.favMovies);
  res.send({msg: '404 not found'});
});

router.get('/movies/:id/add', bearerAuth, (req, res) => {
  Movie.findById(req.params.id)
    .then(movie => {
      console.log(movie);
      console.log(req.user);
      req.user.favMovies.push(movie);
      req.user.save();
    })
    .then(() => console.log(req.user))
    .then(() => res.json(req.user))
    .catch(() => res.status(400).send('bad request'));
});

router.delete('/movies/:id/delete', bearerAuth, (req, res) => {
  let movieIndex = req.user.favMovies.indexOf(req.params.id);
  req.user.favMovies.splice(movieIndex, 1);
  req.user.save()
    .then(() => res.json(req.user.favMovies))
    .catch(() => res.status(400).send('bad request'));
});
