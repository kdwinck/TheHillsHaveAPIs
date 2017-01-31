'use strict';

const server = require('../server');
const request = require('superagent');
const expect = require('chai').expect;
const User = require('../model/user');
require('../server');

const PORT = process.env.PORT || 3000;
const url = 'http://localhost:3000';

// const mockReview = {
//   rating: 10,
//   reviewText: 'test review',
// };

const mockUser = {
  username: 'testyMctesterson',
  password: 'test',
  email: 'test@testy.test',
  favMovies: [],
  reviews: [],
};

// const mockMovie = {
//   original_title: 'Test',
//   release_date: '2000-01-01',
//   overview: 'testing my patience',
//   rating: 10,
//   reviews: [],
// };

describe('A User Route', function(){
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
  describe('/signup', function() {
    it('should sign up a user', function(done) {
      request.post(`${url}/signup`)
        .set('Content-type', 'application/json')
        .send({username: 'Test', password: 'password', email: 'test@email.com'})
        .end( (err, res) => {
          console.log(res.body);
          expect(res.status).to.equal(200);
          expect(res.text).to.equal('successful user signup');
          done();
        });
    });
    it('should respond 400 if no username', function(done) {
      request.post(`${url}/signup`)
        .send({'password': 'password', 'email': 'test@email.com'})
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('no username');
          done();
        });
    });
    it('should respond 400 if no password', function(done) {
      request.post(`${url}/signup`)
        .send({'username': 'username', 'email': 'test@email.com'})
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('no password');
          done();
        });
    });
  });
  describe('/login', function() {
    let tokenData;
    let testUser = new User(mockUser);
    before(done => {
      testUser.hashPassword(testUser.password)
        .then(() => testUser.save())
        .then(user => user.generateToken())
        .then(token => {
          tokenData = token;
          done();
        })
        .catch(done);
    });
    after(done => {
      User.remove({})
        .then(() => done())
        .catch(done);
    });
    it('will return a newly generated token', function(done) {
      request.get(`${url}/login`)
        .auth('testyMctesterson', 'test')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.equal(tokenData);
          console.log(res.body);
          done();
        });
    });
    it('will respond 401 with wrong password', function(done) {
      request.get(`${url}/login`)
        .auth('testyMctesterson', 'wrong')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.text).to.equal('wrong password');
          done();
        });
    });
    it('will respond 500 if a user isnt retrieved', function(done) {
      request.get(`${url}/login`)
        .auth('wrong', 'test')
        .end((err, res) => {
          expect(res.status).to.equal(500);
          expect(res.text).to.equal('server error');
          done();
        });
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
      .then(() => done())
      .catch(done);
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
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('testyMctesterson');
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

  describe('Auth /GET for auth-users', function() {
    let tokenData;
    before(done => {
      new User(mockUser).save()
      .then(user => {
        return user.generateToken();
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
          expect(res.status).to.equal(200);
          expect(res.body[0].username).to.equal('testyMctesterson');
          done();
        });
    });
    it('will return 400 if no auth header is present', function(done) {
      request.get(`${url}/auth-users`)
        .end( (err, res) => {
          expect(res.status).to.equal(400);
          expect(res.text).to.equal('no auth header');
          done();
        });
    });
    it('will return 500 for a server error', function(done) {
      request.get(`${url}/auth-users`)
        .set('Authorization', 'Bearer ' + 12345)
        .end( (err, res) => {
          expect(res.status).to.equal(500);
          expect(res.text).to.equal('server error');
          done();
        });
    });
  });
  describe('/UPDATE a user', function() {
    let tokenData;
    // let user;
    before(done => {
      new User(mockUser).save()
      .then(user => {
        // let user = this.user;
        return user.generateToken();
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
    it('will update a user', function(done) {
      request.put(`${url}/users`)
      .set('Authorization', 'Bearer ' + tokenData)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        console.log('before res.body log');
        console.log(res.body);
        done();
      });
    });

    // it('will not delete user in the database - No Token', function(done) {
    //   request.delete(`${url}/users`)
    //   .set('Authorization', 'Bearer ' + '')
    //   .end((err, res) => {
    //     expect(res.status).to.equal(500);
    //     expect(res.text).to.equal('server error');
    //     done();
    //   });
    //
    // });
    // it('will not delete user in database - Invalid Token Passed', function(done) {
    //   request.delete(`${url}/users`)
    //   .auth('TestName', 'pass')
    //   .end((err, res) => {
    //     expect(res.status).to.equal(400);
    //     expect(res.text).to.equal('token error');
    //     done();
    //   });
    // });
  });

  describe('/DELETE a user', function() {
    let tokenData;
    // let user;
    before(done => {
      new User(mockUser).save()
      .then(user => {
        // let user = this.user;
        return user.generateToken();
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
    it('will delete user in the database - Correct Token', function(done) {
      request.delete(`${url}/users`)
      .set('Authorization', 'Bearer ' + tokenData)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        console.log('before res.body log');
        console.log(res.body._id);
        done();
      });
    });

    it('will not delete user in the database - No Token', function(done) {
      request.delete(`${url}/users`)
      .set('Authorization', 'Bearer ' + '')
      .end((err, res) => {
        expect(res.status).to.equal(500);
        expect(res.text).to.equal('server error');
        done();
      });

    });
    it('will not delete user in database - Invalid Token Passed', function(done) {
      request.delete(`${url}/users`)
      .auth('TestName', 'pass')
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.text).to.equal('token error');
        done();
      });
    });
  });


});
