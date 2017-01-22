'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let movieSchema = Schema ({
  original_title: {type: String}, // movie name
  release_date: {type: String},  // release date
  addDate: {type: Date},         // date added to collection
  overview: {type: String},     // small synap
  rating: Number,
  reviews: [{type:Schema.Types.ObjectId, ref:'review'}]
});

movieSchema.methods.updateRating = function() {
  let numReviews = this.reviews.length;
  this.reviews.map(review => {
    return review.rating;
  })
  .reduce((a, b) => {
    return a + b;
  })
  .then(totalRatings => this.rating = totalRatings/numReviews);
};

module.exports = mongoose.model('movie', movieSchema);
