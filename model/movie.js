'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let movieSchema = Schema ({
  original_title: {type: String},
  release_date: {type: String},
  overview: {type: String},
  rating: Number,
  reviews: [{type:Schema.Types.ObjectId, ref:'review'}]
});

movieSchema.methods.calcRating = function() {
  return new Promise((resolve, reject)=> {
    if (this.reviews.length) {
      let numReviews = this.reviews.length;
      let total = this.reviews.map(review => {
        return review.rating;
      })
      .reduce((a, b) => {
        return a + b;
      }, 0);
      this.rating = total/numReviews;
      this.save().then(resolve(this));
    }
    resolve(this);
    reject('error');
  });
};

module.exports = mongoose.model('movie', movieSchema);
