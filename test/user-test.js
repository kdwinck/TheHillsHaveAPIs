'use strict';

let expect = require('chai').expect;
let request = require('superagent');
let mongoose = require('mongoose');

let Movie = require('../model/movie');
let Review = require('../model/review');
let User = require('../model/user');
let url = 'http://localhost:3000';

let server = require('../server');

let testUser = {
  username: 'Ash',
  password: 'password',
  email: 'boomstick@evildead.com',
  addDate: '',
  favMovies: [],
  reviews: []
};
describe('a user module', function() {
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

    describe('/users', function() {
      before(done => {
        new User(testUser).save();
        done();
      });
      after(done => {
        User.remove({})
          .then(() => done())
          .catch(done);
      });

      it('will return an array of user objects', done => {
        request.get(`${url}/users`)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(typeof res.body).to.equal(typeof []);
            done();
          });
      });
    });

    describe('/users/:id', function() {
      before(done => {
        new User(testUser).save()
          .then( user => {
            this.testUser = user;
            done();
          });
      });
      after(done => {
        User.remove({})
          .then(() => done())
          .catch(done);
      });

      it('will return a user object', done => {
        console.log(this.testUser);
        request.get(`${url}/users/${this.testUser._id}`)
          .end( (err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.username).to.equal('Ash');
            expect(res.body.password).to.equal('password');
            expect(res.body.email).to.equal('boomstick@evildead.com');
            done();
          });
      });
    });


  });
});
