'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let reviewSchema = Schema ({
  rating: {type: Number},       // movie rating
  reviewText: {type: String},         // text of review
});

module.exports = mongoose.model('review', reviewSchema);
