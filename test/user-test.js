'use strict';

const server = require('../server');
const request = require('superagent');
const expect = require('chai').expect;
const User = require('../model/user');
require('../server');

const PORT = process.env.PORT || 3000;
process.env.MONGODB_URI = 'mongodb://localhost/devMidterm';

const url = 'http://localhost:3000'; //add endpoint?
const mockUser = {
  username: 'testName',
  password: 'testPassword',
  email: 'test@testies.test',
  favMovies: 'howthefuckdoitestthis',
};



//when testing for a token call generateToken() and assign it to token, then pass it through the test.
//when testing

// describe('should test routes', function(){
//   before('start the server', function(done) {
//     if(server.isListening === 'false'){
//       server.listen(PORT, function(){
//         done();
//       });
//     };
//   });
//   after('should turn the server off', function(done) {
//     let server.isListening = true;
//   })
// })
