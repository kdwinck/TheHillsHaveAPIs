'use strict';

const Router = require('express').Router;
const userRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();
const User = require('../model/user');
const basicAuth = require('../lib/basic-auth-middleware');
const bearerAuth = require('../lib/bearer-auth-middleware');

//signup - doesnt require auth
userRouter.post('/signup', jsonParser, (req, res) => {
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
userRouter.get('/login', basicAuth, (req, res) => {
<<<<<<< HEAD
  // console.log(req.auth);
=======
  console.log(req.auth);
>>>>>>> master
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
  .catch();
});
<<<<<<< HEAD
// Prints out a list of all users
userRouter.get('/users', bearerAuth, (req, res) => {
  console.log('inside /users/ route');
  User.find({})
  .then(user => {
    console.log(user);
    res.send(user);
  });
});

userRouter.get('/users/movies', bearerAuth, (req, res) => {
  console.log('inside users/movie route');
  console.log(req.user);

  User.findById(req.user._id)
  .populate('movies')
  .then(user => {
    console.log(user);
    return res.send(user.favMovies);
  });
});

userRouter.put('/users/movies/:id', bearerAuth, (req, res) => {
  console.log('inside put route');
  User.findByIdAndUpdate()
})


=======




























//create unauthed GET user/:id/reviews inside user-routes to get ALL user's reviews (first the client has to GET an id from hitting the /users endpoint and use an id from a created/signed up user)
userRouter.get('/user/:id/reviews', (req, res, next) => {
  console.log('inside /user/:id/reviews');
  User.findById(req.params.id)
  .then(user => res.send(user.reviews))//should respond with an array of all user review comments.
  .catch(err => next(err));
});
>>>>>>> master
