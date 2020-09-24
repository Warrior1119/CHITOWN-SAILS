'use strict';
const supertest = require('supertest');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Activation controller', () => {
  describe('#Activation create', () => {
    let mockData;

    beforeEach(done => {
      mock.createUserHash()
      .then(_data => {
        mockData = _data;
        return done();
      })
      .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .get('/activation/' +  mockData.email + '/' + mockData.hash)
       .expect(200)
       .end(err => {
         if(err) return done(err);

         User.findOne({email: mockData.email})
          .then(_user => {
            assert.equal(_user.isActive, true);
            return done();
          })
          .catch(done);
       });
    });
  });
});
