'use strict';
const supertest = require('supertest');
const mock = require('./../../mocks.js');
const assert = require('assert');
describe('#Schedule controller', () => {

  let clientSid;
  let mockClinetFromSession;

  beforeEach(done => {
    mock.createClientSession(true)
    .then(_data => {
      clientSid = _data.session;
      mockClinetFromSession = _data.client;
      return done();
    })
    .catch(done);
  });

  describe('#schedule find one', () => {
    let mockSchedule;

    beforeEach(done => {
      mock.createSchedule(1, mockClinetFromSession.id)
        .then(_schedules => {
          mockSchedule = _schedules[0];
          return done();
        })
         .catch(done);
    });

    it('#should respond 200 status', done => {
      supertest(sails.hooks.http.app)
       .get('/schedule/' + mockSchedule.id)
       .set('token', clientSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.clientId.user, mockClinetFromSession.user);
       })
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .get('/schedule/asd')
       .set('token', clientSid.token)
       .expect(400)
       .end(done);
    });

    it('#should respond 404 status', done => {
      supertest(sails.hooks.http.app)
       .get('/schedule/999')
       .set('token', clientSid.token)
       .expect(404)
       .end(done);
    });
  });

  describe('#schedule find', () => {

    beforeEach(done => {
      mock.createSchedule(3)
        .then(() => done())
         .catch(done);
    });

    it('#should respond 200 status with content', done => {
      supertest(sails.hooks.http.app)
       .get('/schedule/0/3')
       .set('token', clientSid.token)
       .expect(200)
       .end(done);
    });

    it('#should respond 400 status with content', done => {
      supertest(sails.hooks.http.app)
       .get('/schedule/a/3')
       .set('token', clientSid.token)
       .expect(400)
       .end(done);
    });
  });
});
