'use strict';
const mock = require('./../../mocks.js');
const assert = require('assert');
const faker = require('faker');

describe('#Order service', () => {

  describe('Create order', () => {
    let seed;
    let product;

    beforeEach(done => {
      mock.createShopItem()
        .then(_items => {
          product = _items[0];

          mock.createClient()
            .then(_clients => {
              seed = {
                productId: _items[0].id,
                quantity: faker.random.number(),
                discount: faker.random.word(),
                clientId: _clients[0].id
              };
              return done();
            })
            .catch(err => done(Error(err)));
        })
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with content', done => {
      OrderService.create(Object.assign({}, seed))
      .then(_item => {
        assert.equal( _item.productId, seed.productId);
        assert.equal( _item.name, product.name);
        assert.equal( _item.quantity, seed.quantity);
        assert.notEqual( _item.cost, 0);
        assert.equal( _item.discount, product.discount);
        assert.equal( _item.clientId, seed.clientId);
        return done();
      })
      .catch(done);
    });
  });

  describe('Find all orders', () => {
    beforeEach(done => {
      mock.createOrder(4)
        .then(() => done())
        .catch(err => done(Error(err)));
    });

    it('#should return fulfilled with content', done => {
      OrderService.find({start: new Date('2015').getTime(), end: new Date('2018').getTime()})
      .then(_items => {
        assert.equal(_items.length, 4);
        return done();
      })
      .catch(done);
    });
  });
});
