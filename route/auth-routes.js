'use strict';

const Router = require('express').Router;
const authRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();
const User = require('../model/user');

//authorize login
authRouter.post('/login', jsonParser, (req, res) => {
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