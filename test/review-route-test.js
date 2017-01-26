'use strict';

const server = require('../server');
const request = require('superagent');
const expect = require('chai').expect;
const User = require('../model/user');
const Review = require('../model/review');
const Movie = require('../model/movie');
require('../server');

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/devMidtermTest';
const url = 'http://localhost:3000';

const mockReview = {
  rating: 10,
  reviewText: 'test review',
};

const mockUser = {
  username: 'testyMctesterson',
  password: 'test',
  email: 'test@testy.test',
  favMovies: [],
  reviews: [],
};

const mockMovie = {
  original_title: 'Test',
  release_date: '2000-01-01',
  overview: 'testing my patience',
  rating: 10,
  reviews: [],
};

describe('should start and kill server per unit test', function(){
  before('start the server', function(done){
    if(server.isRunning === false){
      server.listen(PORT, function(){
        server.isRunning = true;
        done();
      });
    } else {
      done();
    }
  });
  after('should turn the server off', function(done){
    server.close((err) => {
      server.isRunning = false;
      if(err){
        done(err);
      } else {
        done();
      }
    });
  });
  describe('testing unauthed GET for user\'s reviews', function(){
    //before anything, setup server and insert reviews into a user property (array) of reviews. so, must instantiate a new Review object with the mockReview object, as well as instantiate a new User object with mockUser
    before('instantiate Review schema with mockReview', function(){

    })
    after('')
    describe('/user/:id/reviews', function(done){
      it('will return an array of user reviews'), done => {
        request.get(`${url}/user/${req.params.id}/reviews`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          console.log(res.body);
          expect(res.body).to.equal();
        })
      };
    });
  });
});

// reviewRouter.get('/user/:id/reviews', (req, res, next) => {
//   console.log('inside /user/:id/reviews');
//   User.findById(req.params.id)
//   .then(user => res.send(user.reviews))//should respond with an array of all user review comments.
//   .catch(err => next(err));
// });
