'use strict';
const supertest = require('supertest');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Training type controller', () => {

  let sailsSid;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;
      return done();
    })
    .catch(done);
  });



  describe('#Training type find', () => {
    let mockTrainingTypesLength;

    beforeEach(done => {
      mock.createTrainingType(3)
        .then(_trainings => {
          mockTrainingTypesLength = _trainings.length;
          return done();
        })
        .catch(done);
    });

    it('#should respond 200 status with content', done => {
      supertest(sails.hooks.http.app)
       .get('/training-type')
       .set('token', sailsSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, mockTrainingTypesLength);
       })
       .end(done);
    });
  });
});
