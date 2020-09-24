'use strict';
const supertest = require('supertest');
const mock = require('./../../mocks.js');
const assert = require('assert');
describe('#Session controller', () => {
  describe('#Session create', () => {
    let mockClient;

    beforeEach(done => {
      mock.createClient()
      .then(_clients => {
        mockClient = _clients[0];
        return done();
      })
      .catch(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .post('/session')
       .send({email: mockClient.user, password: mockClient.plainTextPassword})
       .expect(201)
       .expect(res => {
         assert.notEqual(res.body.token, {});
         assert.notEqual(res.body.token, undefined);
       })
       .end(done);
    });

    it('#should respond 401 status', done => {
      supertest(sails.hooks.http.app)
       .post('/session')
       .send({email: mockClient.user, password: mockClient.plainTextPassword + 'asd'})
       .expect(401)
       .end(done);
    });

  });
});
