'use strict';

const createError = require('http-errors');

module.exports = function(req, res, next){
  console.log('hit basic route');
  let authHeader = req.headers.authorization;
  if(!authHeader){
    return next(createError(401, 'no header provided'));
  }
  let base64string = authHeader.split('Basic ')[1];
  if(!base64string) return next(createError(401, 'no username or pw'));

  let bufferString = new Buffer(base64string, 'base64').toString();
  let authArray = bufferString.split(':');

  req.auth = {
    username: authArray[0],
    password: authArray[1],
  };
  if(!req.auth.username){
    return next(createError(401, 'requires username'));
  }
  if(!req.auth.password){
    return next(createError(401, 'requires password'));
  }
  next();
};
