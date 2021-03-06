'use strict';

const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

//grab token off header and do something with user

module.exports = (req, res, next) => {
  if(!req.headers.authorization) return next(createError(400, 'no auth header')); //create error handling middleware to mount in server/app.use [if err.status exists, res.send and next it]
  let authHeader = req.headers.authorization;
  
  if(!authHeader.split('Bearer')[1]) return next(createError(400, 'token error'));
  let token = authHeader.split('Bearer ')[1];

  //decoded is actually named id:this._id on the user object ONCE it is signed up!
  jwt.verify(token, process.env.SECRET || 'DEV', (err, decodedToken) => {
    if(err) return next(err);

    User.findById(decodedToken.id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => next(createError(404, 'user not found')));
  });
};
