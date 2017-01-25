'use strict';

const server = require('../server');
const request = require('superagent');
const expect = require('chai').expect;
const User = require('../model/user');
require('../server');

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/devMidtermTest';

const url = 'http://localhost:3000'; //add endpoint?
const mockUser = {
  username: 'testName',
  password: 'testPassword',
  email: 'test@testies.test',
  favMovies: [],
  reviews: [],
};

//when testing for a token call generateToken() and assign it to token, then pass it through the test.
//when testing

describe('should test routes', function(){
  before('start the server', function(done) {
    if(server.isRunning === false){
      server.listen(PORT, function(){
        server.isRunning = true;
        done();
      });
    } else {
      done();
    }
  });
  after('should turn the server off', function(done) {
    server.close((err) => {
      server.isRunning = false;
      if(err){
        done(err);
      } else {
        done();
      }
    });
  });
  //test signup route
  describe('testing signup POST', function(){
    it('will signup/save a user', function(done){
      request.post(`${url}/signup`)
      .send(mockUser)
      .end( (err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('successful user signup');
        done();
      });
    });
  });
  describe('unauthed GET users', function(){
    it('display a list of user Ids', function(done) {
      request.get(`${url}/users`)
      .end( (err, res) => {
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        expect(res.body.length).to.equal(1);
        done();
      });
    });
  });
});

// 'use strict';
//
// let expect = require('chai').expect;
// let request = require('superagent');
// let mongoose = require('mongoose');
//
// let User = require('../model/user');
// let url = 'http://localhost:3000';
// let server = require('../server');

// let testUser = {
//   username: 'Ron Dunphy',
//   password: 'password4321',
//   email: 'applesauce@gmail.com'
// };
//
//
// describe('GET the user object', function() {
//
//   describe('/users', function() {
//     before( function(done) {
//       new User(testUser).save();
//       done();
//     });
//     after(done => {
//       User.remove({})
//       .then(() => done())
//       .catch(done);
//     });
//
//     it('will return a user object', function(done) {
//       request.get(`${url}/users`)
//       .end( function(err, res) {
//         expect(typeof res.body).to.equal(typeof {});
//         done();
//       });
//     });
//   });
// });
//
// describe('should return the users _id number', function() {
//
//   describe('/users', function() {
//     let userData;
//     before( function(done) {
//       new User(testUser).save()
//       .then( function(newUser) {
//         userData = newUser;
//         done();
//       });
//     });
//     after(done => {
//       User.remove({})
//       .then(() => done())
//       .catch(done);
//     });
//     it('will have a user _id', function(done) {
//       console.log(userData);
//       request.get(`${url}/users`)
//       .end((err, res) => {
//         // console.log(res.body);
//         expect(res.body[0].id).to.equal(userData._id);
//         done();
//       });
//     });
//   });
// });
