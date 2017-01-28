'use strict';

const server = require('../server');
const request = require('superagent');
const expect = require('chai').expect;
const User = require('../model/user');
require('../server');

const PORT = process.env.PORT || 3000;
// process.env.MONGODB_URI = 'mongodb://localhost/devMidtermTest';
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
  describe('Un-Auth /GET for users', function() {
    let userTest;
    before(done => {
      new User(mockUser).save()
      .then(user => {
        userTest = user;
        userTest.save();
      })
      .then(() => done());
    });
    after(done => {
      User.remove({})
      .then(() => done())
      .catch(done);
    });
    it('will return an array of ONLY USER IDs', function(done){
      request.get(`${url}/users`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        expect(res.body[0].id).to.equal(this.id);
        done();
      });
    });
    it('will Error if invalid url given', function(done) {
      request.get(`${url}/games`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        done();
      });
    });
    it('Will Give Additional USER INFO', function(done) {
      request.get(`${url}/users/${userTest._id}`)
      // console.log(userTest._id)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('testyMctesterson');
        // expect(res.body.password).to.equal();
        expect(res.body.email).to.equal('test@testy.test');
        expect(Array.isArray(res.body.reviews)).to.equal(true);
        expect(Array.isArray(res.body.favMovies)).to.equal(false);
        done();
      });
    });
  });
  describe('/users/:id', function() {
    let userTest;
    before(done => {
      new User(mockUser).save()
      .then(user => {
        userTest = user;
        userTest.save();
      })
      .then(() => done());
    });
    after(done => {
      User.remove({})
      .then(() => done())
      .catch(done);
    });
    it('will return the requested user with limitied information', function(done){
      request.get(`${url}/users/${userTest._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body._id).to.equal(userTest.id);
        expect(res.body.username).to.equal('testyMctesterson');
        done();
      });
    });
    it('Will give error for invalid USER ID', function(done) {
      request.get(`${url}/users/5555`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
    });
  });

  describe('/auth-users', function() {
    let tokenData;
    before(done => {
      new User(mockUser).save()
      .then(user => {
        user.generateToken();
      })
      .then(token => {
        tokenData = token;
        done();
      });
    });
    after(done => {
      User.remove({})
      .then(() => done())
      .catch(done);
    });

    it('will return all users full public information', function(done) {
      request.get(`${url}/auth-users`)
        .set('Authorization', 'Bearer ' + tokenData)
        .end( (err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
});
