'use strict';

const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

//grab token off header and do something with user

module.exports = (req, res, next) => {
  // if(!authHeader) return next(createError(400, 'no auth header')); //create error handling middleware to mount in server/app.use [if err.status exists, res.send and next it]
  if(!req.headers.authorization) return res.status(400).json({msg: 'no auth header'});
  let authHeader = req.headers.authorization;

  if(!authHeader.split('Bearer')[1]) return res.status(400).json({msg: 'no token'});
  let token = authHeader.split('Bearer ')[1];
  // if(!token) return next(createError(400, 'unauthorized request'));

  //decoded is actually named id:this._id on the user object ONCE it is signed up!
  jwt.verify(token, process.env.SECRET || 'DEV', (err, decodedToken) => {
    if(err) return res.status(500).json({msg: 'server error'});

    User.findById(decodedToken.id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(() => res.status(404).json({msg: 'user not fucking found'}));
  });
};
