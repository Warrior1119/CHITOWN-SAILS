'use strict';
const supertest = require('supertest');
const assert = require('assert');
const mock = require('./../../mocks.js');

describe('#Download controller', () => {

  let client;
  let clientSid;

  beforeEach(done => {
    mock.createClientSession(true)
      .then(_clietnSid => {
        client = _clietnSid.client;
        clientSid = _clietnSid.session;
        return done();
      })
      .catch(done);
  });


  describe('#Download invoice', () => {
    let mockFileName;

    beforeEach(done => {
      mock.createInvoice(1, client.user)
        .then(_file => {
          mockFileName = _file[0].fileName;
          return done();
        })
        .catch(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .get(`/download/${mockFileName}`)
       .set('token', clientSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.type, 'application/pdf');
         assert.notEqual(res.text, '');
       })
       .end(done);
    });
  });
});
