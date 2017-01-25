'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

let userSchema = Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  addDate: {type: Date},
  favMovies: [{type:Schema.Types.ObjectId, ref: 'movie'}],
  reviews: [{type:Schema.Types.ObjectId, ref:'review'}]
});

//to be used inside of unauthed post/signup route
userSchema.methods.hashPassword = function(password){
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if(err){
        console.log(err);
        reject(err);
      }
      this.password = hash;
      resolve(this);
    });
  });
};

//CALLED inside of a signup route as a res.send as well as other authorized routes
userSchema.methods.generateToken = function() {
  // return new Promise((resolve, reject) => {
  // console.log('ID ', this.id);
    //this is where we attach a token as a property of the user ({pw = this._id}) to create an association between the logged in user and the server
  return jwt.sign({id: this._id}, 'DEV');//, (err, token) => {
      // console.log('JWT 1');
      // if(err) return reject(createError(401, 'invalid id'));
      // if(!token) return reject(createError(401, 'bad token'));
      // console.log('JWT 2');
      // resolve(this);
    // });
  // });
};

//this is for a login route. we need it to check against a saved user in our db
userSchema.methods.compareHashPassword = function(password){
  console.log('in hash password');
  return new Promise((resolve, reject) => {
    console.log('inside promise');
    bcrypt.compare(password, this.password, (err, valid) => {
      if(err) return reject(err);
      if(!valid) return reject(createError(401, 'wrong password'));
      resolve(this);
    });
  });
};


module.exports = mongoose.model('user', userSchema);
