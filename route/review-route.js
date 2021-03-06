'use strict';

const Router = require('express').Router;
const reviewRouter = module.exports = new Router();
const bearerAuth = require('../lib/bearer-auth-middleware');
const Review = require('../model/review');
const User = require('../model/user');
const Movie = require('../model/movie');



//create unauthed GET user/:id/reviews inside user-routes to get ALL user's reviews (first the client has to GET an id from hitting the /users endpoint and use an id from a created/signed up user)
//not tested - requires review relationship and route first?
reviewRouter.get('/user/:id/reviews', (req, res, next) => {
  User.findById(req.params.id)
  .populate('reviews')
  .then(user => res.send(user.reviews))//should respond with an array of all user review comments.
  .catch(err => next(err));
});

//create authed GET /reviews which shows all user reviews they have written (kyle is working on POST users/:id/movies/:id/reviews which allows users to POST a review.)
//not tested - requires review relationship and route first?
reviewRouter.get('/user/reviews', bearerAuth, (req, res, next) => {
  User.findById(req.user._id)
  .populate('reviews')
  .then(user => {
    return res.send(user.reviews);
  })
  .catch(err => next(err));
});

//create authed DELETE for a user to delete a single review for a specific movie
// DELETE movies/:id/reviews - and call .updateRating from movieSchema, push new value and save?
//not tested - requires review relationship and route first?
reviewRouter.delete('/movies/:movieId/reviews/:reviewId', bearerAuth, (req, res, next) => {
  let reviewIndex;
  Movie.findById(req.params.movieId) //express knows that anything after a colon is a property/variable on the params object
  .then(movie => {
    reviewIndex = movie.reviews.indexOf(req.params.reviewId);
    movie.reviews.splice(reviewIndex, 1);
    return movie.save();
  })
  // .then(() => {
  //   Review.findById(req.params.reviewId);
  // })
  .then(() => Review.remove({_id:req.params.reviewId}))
  .then(() => res.status(204).send(`${reviewIndex} deleted`))
  .catch(err => next(err));
});
