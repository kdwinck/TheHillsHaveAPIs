'use strict';

let expect = require('chai').expect;
let request = require('superagent');
// let mongoose = require('mongoose');

let Movie = require('../model/movie');
let Review = require('../model/review');
let User = require('../model/user');

let url = 'http://localhost:3000';
// let PORT = process.env.PORT || 3000;

require('../server');

let testMovie = {
  original_title: 'Test',
  release_date: '2000-01-01',
  overview: 'bushboozeled again',
  rating: 0,
  reviews: []
};

let testReview = {
  rating: 10,
  reviewText: 'Noice'
};

let testUser = {
  username: 'Kyle',
  password: 'password',
  email: 'kyle@gmail.com'
};

describe('a movie module', function() {
  // before('start the server', function(done) {
  //   if(server.isListening === false){
  //     server.listen(PORT, function(){
  //       server.isListening = true;
  //       done();
  //     });
  //   } else {
  //     done();
  //   }
  // });
  // after('should turn the server off', function(done) {
  //   server.isListening = false;
  //   server.close();
  //   done();
  // });

  describe('GET', function() {

    describe('/movies', function() {
      before(done => {
        new Movie(testMovie).save();
        done();
      });
      after(done => {
        Movie.remove({})
          .then(() => done())
          .catch(done);
      });

      it('will return an array of movie objects', done => {
        request.get(`${url}/movies`)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(typeof res.body).to.equal(typeof []);
            expect(res.body[0].original_title).to.equal('Test');
            done();
          });
      });
    });

    describe('/movies/:id', function() {
      let data;
      before(done => {
        new Movie(testMovie).save()
          .then( movie => {
            data = movie;
            done();
          });
      });
      after(done => {
        Movie.remove({})
          .then(() => done())
          .catch(done);
      });

      it('will return a movie object', done => {
        request.get(`${url}/movies/${data._id}`)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.original_title).to.equal('Test');
            expect(res.body.release_date).to.equal('2000-01-01');
            expect(res.body.overview).to.equal('bushboozeled again');
            expect(typeof res.body).to.equal(typeof {});
            done();
          });
      });
      it('will return 404 if incorrect movie ID provided', done => {
        request.get(`${url}/movies/1234`)
          .end( (err, res) => {
            expect(res.status).to.equal(404);
            expect(res.text).to.equal('movie not found');
            done();
          });
      });
    });

    describe('/movies/title/:title', function() {
      let data;
      before(done => {
        new Movie(testMovie).save()
        .then( movie => {
          data = movie;
          done();
        });
      });
      after(done => {
        Movie.remove({})
          .then(() => done())
          .catch(done);
      });

      it('will return a movie object', done => {
        request.get(`${url}/movies/title/${data.original_title}`)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.rating).to.equal(0);
            expect(res.body.original_title).to.equal('Test');
            expect(res.body.release_date).to.equal('2000-01-01');
            expect(res.body.overview).to.equal('bushboozeled again');
            expect(typeof res.body).to.equal(typeof {});
            done();
          });
      });
      it('will return 404 if incorrect movie title provided', done => {
        request.get(`${url}/movies/title/laksjdf;lajs`)
          .end( (err, res) => {
            expect(res.status).to.equal(404);
            expect(res.text).to.equal('movie not found');
            done();
          });
      });
    });

    describe('/movies/:id/reviews', function() {
      let movieData;
      before(done => {
        new Movie(testMovie).save()
          .then(movie => {
            movieData = movie;
            new Review(testReview).save()
              .then(review => {
                movieData.reviews.push(review);
                movieData.save()
                  .then(() => done());
              });
          });
      });
      after(done => {
        Movie.remove({})
          .then(() => Review.remove({}))
          .then(() =>  done())
          .catch(done);
      });

      it('will return a list of reviews for that movie', done => {
        request.get(`${url}/movies/${movieData._id}/reviews`)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body[0].rating).to.equal(10);
            expect(res.body[0].reviewText).to.equal('Noice');
            done();
          });
      });
    });

    // describe('/favorites', function() {
    //   before(done => {
    //
    //   })
    // });
  });


  describe('/POST', function() {
    describe('/movies/:id/reviews', function() {
      let movieData;
      let tokenData;
      before(done => {
        new Movie(testMovie).save()
          .then(movie => {
            movieData = movie;
            new User(testUser).save()
              .then(user => user.generateToken())
              .then(token => {
                tokenData = token;
                done();
              });
          });
      });
      after(done => {
        Movie.remove({})
          .then(() => User.remove({}))
          .then(() => Review.remove({}))
          .then(() => done())
          .catch(done);
      });

      it('will create a new review', done => {
        request.post(`${url}/movies/${movieData._id}/reviews`)
          .send(testReview)
          .set('Authorization', 'Bearer ' + tokenData)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.rating).to.equal(10);
            expect(res.body.reviewText).to.equal('Noice');
            done();
          });
      });
    });
  });
});
