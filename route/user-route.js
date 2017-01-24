'use strict';

const Router = require('express').Router;
const userRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();
const User = require('../model/user');
const Movie = require('../model/movie');
const basicAuth = require('../lib/basic-auth-middleware');
const bearerAuth = require('../lib/bearer-auth-middleware');

//signup - doesnt require auth
userRouter.post('/signup', jsonParser, (req, res) => {
  req.body.addDate = new Date();
  if(!req.body.username) {
    return res.status(400).send('no username');
  } if(!req.body.password) {
    return res.status(400).send('no password');
  }
  console.log(req.body , ' = req.body');
  let user = new User(req.body);
  user.hashPassword(user.password)
  .then(user => user.save())
  .then(() => res.send('successful user signup'))
  .catch(err => {
    console.log(err);
    res.send(err);
  });
});

//authorize login
userRouter.get('/login', basicAuth, (req, res, next) => {
  if(!req.auth.username) {
    return res.status(400).send('no username');
  } if(!req.auth.password) {
    return res.status(400).send('no password');
  }
  User.findOne({username: req.auth.username})
  .then(user => user.compareHashPassword(req.auth.password))
  .then(user =>  {
    console.log('before OMG');
    return user.generateToken();
  })
  .then(token => {
    console.log(token);
    res.send(token);
  })
  .catch(next);
});

// Prints out a list of all users
userRouter.get('/users', bearerAuth, (req, res) => {
  console.log('inside /users/ route');
  User.find({})
  .then(user => {
    console.log(user);
    res.send(user);
  });
});

// userRouter.get('/users/:id', bearerAuth, (req, res) => {
//   console.log('inside users/movie route');
//   // console.log(req.user);
//
//   User.findById(req.user._id)
//   .populate('movies')
//   .then(user => {
//     console.log(user);
//     res.send(user);
//   });
// });

userRouter.put('/users/', jsonParser, bearerAuth, (req, res) => {
  console.log('inside put route');
  console.log(req.body);
  User.findByIdAndUpdate(req.user.id, req.body)
  .then(user => user.hashPassword(req.body.password))
  .then(user => {
    user.save();
    res.json(user);
  })
  .catch(e => {
    console.log(e);
    res.json({});
  });
});

userRouter.delete('/users/', bearerAuth, (req, res) => {
  console.log('inside delete');
  User.findByIdAndRemove(req.user.id)
  .then(user => res.json(user))
  .catch(e => {
    console.log(e);
    res.json({})
  })
});






























//create unauthed GET user/:id/reviews inside user-routes to get ALL user's reviews (first the client has to GET an id from hitting the /users endpoint and use an id from a created/signed up user)
//not tested - requires review relationship and route first?
userRouter.get('/user/:id/reviews', (req, res, next) => {
  console.log('inside /user/:id/reviews');
  User.findById(req.params.id)
  .then(user => res.send(user.reviews))//should respond with an array of all user review comments.
  .catch(err => next(err));
});

//create authed GET /reviews which shows all user reviews (kyle is working on POST users/:id/movies/:id/reviews which allows users to POST a review.)
//not tested - requires review relationship and route first?
userRouter.get('/reviews', bearerAuth, (req, res, next) => {
  console.log('inside authed user movie reviews');
  User.findById(req.user._id)
  .populate('reviews')
  .then(user => {
    console.log(user);
    return res.send(user.reviews);
  })
  .catch(err => next(err));
});

//create authed DELETE for a user to delete a review for a specific movie
// DELETE movies/:id/reviews - and call .updateRating from movieSchema, push new value and save?
//not tested - requires review relationship and route first?
userRouter.delete('/movies/:id/reviews', bearerAuth, (req, res, next) => {
  console.log('inside authed DELETE route to delete a user specific review on a movie object');
  let reviewIndex;
  Movie.findById(req.movie._id)
  .then(movie => {
    console.log(movie);
    reviewIndex = movie._id.review.indexOf(req.movie._id);
    console.log(reviewIndex);
    movie._id.review.splice(reviewIndex, 1);
    return movie.save();
  })
  .then(() => res.status(204).send(`${reviewIndex} deleted`))
  .catch(err => next(err));
});
