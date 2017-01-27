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
  console.log('inside /user/:id/reviews');
  User.findById(req.params.id)
  .populate('reviews')
  .then(user => res.send(user.reviews))//should respond with an array of all user review comments.
  .catch(err => next(err));
});

//create authed GET /reviews which shows all user reviews they have written (kyle is working on POST users/:id/movies/:id/reviews which allows users to POST a review.)
//not tested - requires review relationship and route first?
reviewRouter.get('/user/reviews', bearerAuth, (req, res, next) => {
  console.log('inside authed user movie reviews');
  User.findById(req.user._id)
  .populate('reviews')
  .then(user => {
    console.log(user);
    return res.send(user.reviews);
  })
  .catch(err => next(err));
});

//create authed DELETE for a user to delete a single review for a specific movie
// DELETE movies/:id/reviews - and call .updateRating from movieSchema, push new value and save?
//not tested - requires review relationship and route first?
reviewRouter.delete('/movies/:movieId/reviews/:reviewId', bearerAuth, (req, res, next) => {
  console.log('inside authed DELETE route to delete a user specific review on a movie object');
  let reviewIndex;
  Movie.findById(req.params.movieId) //express knows that anything after a colon is a property/variable on the params object
  .then(movie => {
    console.log(movie);
    reviewIndex = movie.reviews.indexOf(req.params.reviewId);
    console.log('reviewIndex : ', reviewIndex);
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


//TO DO: authed POST to add movie to favMovie array prop
//

//TO DO: authed GET to get movies from favMovie array prop


//TO DO: authed DELETE to remove movie to favMovie array prop


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
