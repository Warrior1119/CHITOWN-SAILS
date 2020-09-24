'use strict';
const supertest = require('supertest');
const faker = require('faker');
const assert = require('assert');
const mock = require('./../../mocks.js');

describe('#Sku controller', () => {

  let sailsSid;

  beforeEach(done => {
    mock.createSession()
    .then(_sid => {
      sailsSid = _sid;
      return done();
    })
    .catch(done);
  });


  describe('#Sku create', () => {
    let seed;

    beforeEach(done => {
      mock.createShopItem()
      .then(_products => {
        seed = {
          name: faker.commerce.productName(),
          productId: _products[0].id,
          cost: 3000,
          duration: 60,
          quantity: 12
        };

        return done();
      })
      .catch(done);
    });

    it('#should return 201 status with object', done => {
      supertest(sails.hooks.http.app)
       .post('/sku')
       .set('token', sailsSid.token)
       .send(seed)
       .expect(201)
       .expect(res => {
         assert.equal(res.body.name, seed.name);
         assert.equal(res.body.productId, seed.productId);
         assert.equal(res.body.cost, seed.cost);
         assert.equal(res.body.duration, seed.duration);
         assert.equal(res.body.quantity, seed.quantity);
       })
       .end(done);
    });

    it('#should return 400 status', done => {
      seed.productId = 'asd';

      supertest(sails.hooks.http.app)
       .post('/sku')
       .set('token', sailsSid.token)
       .send(seed)
       .expect(400)
       .end(done);
    });
  });

  describe('#Sku update', () => {
    let sku;

    beforeEach(done => {
      mock.createSku()
      .then(_skus => {
        sku = _skus[0];
        return done();
      })
      .catch(done);
    });

    it('#should return 200 status with updated object', done => {
      supertest(sails.hooks.http.app)
       .put(`/sku/${sku.id}`)
       .set('token', sailsSid.token)
       .send({
         cost: 4000
       })
       .expect(200)
       .expect(res => {
         assert.equal(res.body.name, sku.name);
         assert.equal(res.body.productId, sku.productId);
         assert.equal(res.body.cost, 4000);
         assert.equal(res.body.duration, sku.duration);
         assert.equal(res.body.quantity, sku.quantity);
       })
       .end(done);
    });
  });

  describe('#Sku destroy', () => {
    let sku;

    beforeEach(done => {
      mock.createSku()
      .then(_skus => {
        sku = _skus[0];
        return done();
      })
      .catch(done);
    });

    it('#should return 200 status with updated object', done => {
      supertest(sails.hooks.http.app)
       .del(`/sku/${sku.id}`)
       .set('token', sailsSid.token)
       .expect(204)
       .end(done);
    });
  });
});
