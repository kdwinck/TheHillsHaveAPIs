'use strict';

const Router = require('express').Router;
const userRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();
const User = require('../model/user');
// const Movie = require('../model/movie');
// const Review = require('../model/review');
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
  let user = new User(req.body);
  user.hashPassword(user.password)
  .then(user =>  {
    user.save();
    delete req.body.password;
    console.log(req.body , ' = req.body');
  })
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
    return user.generateToken();
  })
  .then(token => {
    // console.log(token);
    res.send(token);
  })
  .catch(next);
});
// UNAUTHORIZED ROUTES ////////////////////////////////////////////////////
// Prints out a list of all users

userRouter.get('/users',(req, res) => {
  console.log('inside unauth /users route');
  User.find({})
  // .populate('movies')
  .then(user => {
    // console.log(user);
    return user.map(function(user) {
      return user._id;
    });
  })
  .then(user => {
    console.log(user);
    res.send(user);
  });
});

userRouter.get('/users/:id', (req, res) => {
  console.log('inside unauth user/id route');
  User.findById(req.params.id).lean()
  .populate('reviews')
  .then(user => {
    // console.log(user);
    delete user.password;
    delete user.favMovies;
    delete user.addDate;
    console.log(user);
    return res.json(user);
  })
  .catch(() => res.status(400).send('user not found'));
});
// AUTHORIZED ROUTES //////////////////////////////////////////////////////

userRouter.get('/auth-users', bearerAuth, (req, res) => {
  console.log('inside auth get users');
  User.find({})
  // .populate('favMovies', 'original_title')
  .then(() =>  {
    return User.findById(req.user._id)
    .populate('favMovies', 'original_title')
    .populate('reviews');
  })
  .then(user => res.json(user))
  .catch(() => res.status(400).send('bad request'));
});

userRouter.put('/users/', jsonParser, bearerAuth, (req, res) => {
  console.log('inside put route');
  User.findByIdAndUpdate(req.user.id, req.body)
  .then(user => user.hashPassword(req.body.password))
  .then(user => {
    user.save();
    delete req.body.password;
    console.log(req.body);
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
    res.json({});
  });
});