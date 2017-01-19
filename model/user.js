'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = Schema({
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  favMovies: [{type:Schema.Types.ObjectId, ref: 'movies'}]
});

module.exports = mongoose.model('user', userSchema);
