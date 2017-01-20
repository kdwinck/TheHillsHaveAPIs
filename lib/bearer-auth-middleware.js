'use strict';

const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

//grab token off header and do something with user

module.exports = (req, res, next) => {
  let authHeader = req.header.authorization;
  if(!authHeader) return next(createError(400, 'no auth header')); //create error handling middleware to mount in server/app.use [if err.status exists, res.send and next it]

  let token = authHeader.split('Bearer ')[1];
  if(!token) return next(createError(400, 'unauthorized request'));

//decoded is actually named id:this._id on the user object ONCE it is signed up!
  let decoded = jwt.verify(token, process.env.SECRET || 'DEV')

  User.findById(decoded.id)
}
