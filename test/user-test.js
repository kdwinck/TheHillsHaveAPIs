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
        User.remove({})
        .then(() => done())
        .catch(done);
        // done();
      });
      });
    });
  });


  describe('unauthed GET users', function(){
    let data;
    before(done => {
      // data.save();
      new User(mockUser).save()
      .then(user => {
        data = user;
      });
      done();
    });
    after(done => {
      User.remove({})
      .then(() => done())
      .catch(done);
    });

    it('display a list of user IDs', function(done) {
      request.get(`${url}/users`)
      .end( (err, res) => {
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        expect(res.body[0]).to.equal(data._id.toString());
        done();
      });
    });
    it('should get a specific user ID info', function(done) {
      request.get(`${url}/users/${data._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.username).to.equal('testName');
        expect(res.body.password).to.equal('testPassword');
        expect(res.body.email).to.equal('test@testies.test');
        expect(typeof res.body).to.equal(typeof []);
        done();
      });
    });
  });

});
