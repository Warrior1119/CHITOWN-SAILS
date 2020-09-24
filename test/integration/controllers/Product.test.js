'use strict';
const supertest = require('supertest');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Product controller', () => {

  let sailsSid;
  let clientSid;
  let clientWithSession;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;
      mock.createClientSession(true)
      .then(_data => {
        clientWithSession = _data.client;
        clientSid = _data.session;
        return done();
      })
      .catch(err => done(Error(err)));
    })
    .catch(err => done(Error(err)));
  });

  describe('#Product find', () => {
    let mockProductsLength;

    beforeEach(done => {
      mock.createProduct(3, clientWithSession.id)
        .then(_products => {
          mockProductsLength = _products.length;
          done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .get('/product')
       .set('token', clientSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, mockProductsLength);
       })
       .end(done);
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .get('/product')
       .set('token', clientSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.length, mockProductsLength);
       })
       .end(done);
    });
  });

  describe('#Product find one', () => {
    let mockProduct;

    beforeEach(done => {
      mock.createProduct(3, clientWithSession.id)
        .then(_products => {
          mockProduct = _products[0];
          done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should respond 201 status', done => {
      supertest(sails.hooks.http.app)
       .get('/product/' + mockProduct.id)
       .set('token', clientSid.token)
       .expect(200)
       .expect(res => {
         assert.equal(res.body.id, mockProduct.id);
       })
       .end(done);
    });

    it('#should respond 404 status', done => {
      supertest(sails.hooks.http.app)
       .get('/product/99')
       .set('token', clientSid.token)
       .expect(404)
       .end(done);
    });

    it('#should respond 400 status', done => {
      supertest(sails.hooks.http.app)
       .get('/product/1')
       .set('token', sailsSid.token)
       .expect(404)
       .end(done);
    });
  });
});
