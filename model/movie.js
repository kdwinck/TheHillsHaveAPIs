'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let movieSchema = Schema ({
  original_title: {type: String},
  release_date: {type: String},
  overview: {type: String},
  reviews: [{type:Schema.Types.ObjectId, ref:'review'}]
});

movieSchema.methods.calcRating = function(res) {
  return new Promise((reject, resolve)=> {
    let numReviews = this.reviews.length;
    let total = this.reviews.map(review => {
      return review.rating;
    })
    .reduce((a, b) => {
      return a + b;
    }, 0);
    res.overallRating = total/numReviews;
    resolve(this);
    reject('balls');
  });
};

module.exports = mongoose.model('movie', movieSchema);
