'use strict';
const mock = require('./../../mocks.js');
const faker = require('faker');
const assert = require('assert');

describe('#Product service', () => {

  describe('#Create product', () => {
    let seed;
    beforeEach(done => {
      mock.createClient()
        .then(_clients => {
          seed = {
            name: faker.commerce.productName(),
            clientId: _clients[0].id,
            quantity: faker.random.number()
          };
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with product object', done => {
      ProductService.createOrUpdate(Object.assign({}, seed))
        .then(_product => {
          assert.equal(_product.name, seed.name);
          assert.equal(_product.clientId, seed.clientId);
          assert.equal(_product.quantity, seed.quantity);
          return done();
        })
        .catch(err => done(Error(err)));
    });

  });

  describe('#Update product', () => {
    let mockProduct;
    let mockOldQuantity;


    beforeEach(done => {
      mock.createProduct()
        .then(_product => {
          mockProduct = _product[0];
          mockOldQuantity = mockProduct.quantity;
          mockProduct.quantity += 12;
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with prospect product object', done => {
      ProductService.createOrUpdate(mockProduct)
        .then(_product => {
          assert.equal(_product.quantity - 12, mockOldQuantity);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });

  describe('#Find product', () => {
    let mockProtucts;

    beforeEach(done => {
      mock.createProduct(4)
        .then(_products => {
          mockProtucts = _products;
          return done();
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with content', done => {
      ProductService.find(mockProtucts[0].clientId)
        .then(_products => {
          assert.equal(_products.length, mockProtucts.length);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });

  describe('#Find one product', () => {
    let mockProduct;

    beforeEach(done => {
      mock.createProduct()
        .then(_products => {
          mockProduct = _products[0];
          return done();
        })
        .catch(err => done(Error(err)));
    });


    it('#should return fulfilled with content', done => {
      ProductService.findOne(mockProduct.id, mockProduct.clientId)
        .then(_product => {
          assert.equal(_product.id, mockProduct.id);
          assert.equal(_product.clientId, mockProduct.clientId);
          return done();
        })
        .catch(err => done(Error(err)));
    });
  });
});
