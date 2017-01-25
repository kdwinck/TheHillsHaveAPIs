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
    after(done => {
      User.remove({})
    .then(()=> {
      done();
    });
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
  });
  describe('unauthed GET users', function(){
    let mockUserId;
    before(done => {
      mockUserId = new User(mockUser);
      mockUserId.save();
      console.log(mockUserId);
      done();
    });
    it('display a list of user Ids', function(done) {
      request.get(`${url}/users`)
      .end( (err, res) => {
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        expect(res.body[0]).to.equal(mockUserId._id.toString());
        done();
      });
    });
  });
});
