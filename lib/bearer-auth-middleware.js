'use strict';

const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

//grab token off header and do something with user

module.exports = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if(!authHeader) return next(createError(400, 'no auth header')); //create error handling middleware to mount in server/app.use [if err.status exists, res.send and next it]

  let token = authHeader.split('Bearer ')[1];
  if(!token) return next(createError(400, 'unauthorized request'));
//decoded is actually named id:this._id on the user object ONCE it is signed up!
  jwt.verify(token, process.env.SECRET || 'DEV', (err, decodedToken) => {
    if(err) return next(createError(500, 'server error'));

    User.findById(decodedToken.id)
    .then(user => {
      console.log('about to end bearer');
      req.user = user;
      next();
    })
    .catch(() => next(createError(400, 'invalid token/cant find user')));
  });
};
