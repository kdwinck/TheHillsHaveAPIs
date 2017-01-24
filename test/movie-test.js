'use strict';

let expect = require('chai').expect;
let request = require('superagent');
let mongoose = require('mongoose');

let Movie = require('../model/movie');
let Review = require('../model/review');
let url = 'http://localhost:3000';

let server = require('../server');

let testMovie = {
  original_title: 'Test',
  release_date: '2000-01-01',
  overview: 'bushboozeled again',
  rating: 0,
  reviews: []
};

let testReview = {
  rating: 10,
  reviewText: 'Noice',
};

let testUser = {
  user
}

describe('a movie module', function() {
  // let server;
  //
  // before(done => {
  //   server = require('../server');
  //   server.listen(3000);
  //   done();
  // });
  // after(done => {
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
            done();
          });
      });
    });

    describe('/movies/:id', function() {
      before(done => {
        new Movie(testMovie).save()
          .then( movie => {
            this.testMovie = movie;
            done();
          });
      });
      after(done => {
        Movie.remove({})
          .then(() => done())
          .catch(done);
      });

      it('will return a movie object', done => {
        request.get(`${url}/movies/${this.testMovie._id}`)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.original_title).to.equal('Test');
            expect(res.body.release_date).to.equal('2000-01-01');
            expect(res.body.overview).to.equal('bushboozeled again');
            expect(typeof res.body).to.equal(typeof []);
            done();
          });
      });
    });

    describe('/movies/title/:title', function() {
      before(done => {
        new Movie(testMovie).save()
          .then( movie => {
            this.testMovie = movie;
            done();
          });
      });
      after(done => {
        Movie.remove({})
          .then(() => done())
          .catch(done);
      });

      it('will return a movie object', done => {
        request.get(`${url}/movies/title/${this.testMovie.original_title}`)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.rating).to.equal(0);
            expect(res.body.original_title).to.equal('Test');
            expect(res.body.release_date).to.equal('2000-01-01');
            expect(res.body.overview).to.equal('bushboozeled again');
            expect(typeof res.body).to.equal(typeof []);
            done();
          });
      });

      describe('/movies/:id/reviews', function() {
        before(done => new Movie(testMovie).save())
            .then(() => new Review(testReview).save())
              .then(() => new User(testUser).save())
                .then(() => done())
        });
        after(done => {
          Movie.remove({})
            .then(() => Review.remove({}))
            .then(() =>  done())
            .catch(done);
        });

        it('will return a list of reviews for that movie', done => {
          request.get('/movies/:id/reviews')
            .end( (err, res) => {
              expect(res.status).to.equal(200);
              // expect(res.body).to.equal([]);
              done();
            });
        });
      });
    });
  });
});
