'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reviewSchema = Schema ({
  // UserID: {type: String}, // User ID
  // MovieID: {type: String},  // movie ID
  rating: {type: Number},       // movie rating
  reviewText: {type: String},         // text of review
});

module.exports = mongoose.model('review', reviewSchema);
