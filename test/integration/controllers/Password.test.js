'use strict';
const supertest = require('supertest');
const mock = require('./../../mocks.js');

describe('#Password controller', () => {
  describe('#Password remind', () => {

    let mockClient;

    beforeEach(done => {
      mock.createClient()
      .then(clients => {
        mockClient = clients[0];
        return done();
      })
      .catch(done);
    });


    it('#should respond 201 status without content', done => {
      supertest(sails.hooks.http.app)
       .get('/password/' + mockClient.user)
       .expect(204)
       .end(done);
    });

    it('#should respond 201 status without content', done => {
      supertest(sails.hooks.http.app)
       .get('/password/johnconor.com')
       .expect(400)
       .end(done);
    });

    it('#should respond 201 status without content', done => {
      supertest(sails.hooks.http.app)
       .get('/password/john@conor.com')
       .expect(404)
       .end(done);
    });
  });
});
