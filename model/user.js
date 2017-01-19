'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let userSchema = Schema({
  name: {type: String, required: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  createDate: {type: Date},
  movies: [{type:Schema.Types.ObjectId, ref: 'movies'}]
});

module.exports = mongoose.model('user', userSchema);
