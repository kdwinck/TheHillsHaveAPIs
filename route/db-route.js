require('es6-promise').polyfill();
require('isomorphic-fetch');

const Movie = require('../model/movie');
const Router = require('express').Router;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

let router = module.exports = new Router();

router.get('/api/getMovies/:page', (req, res) => {
  fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=27&page=${req.params.page}&include_video=false&include_adult=true&sort_by=vote_count.desc&language=en-US&api_key=${TMDB_API_KEY}`)
    .then(body => {
      body.buffer()
        .then(data => JSON.parse(data.toString()))
        .then(data => {
          return data.results.map(function(movie) {
            return {original_title: movie.title, release_date: movie.release_date, overview: movie.overview, rating: 0};
          });
        })
    .then(db => db.forEach(movie => { 
      let dbMovie = new Movie(movie);
      dbMovie.save();
    }))
    .then(() => res.send('Complete'))
    .catch(err => console.error(err));
    });
});
