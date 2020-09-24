'use strict';
const mock = require('./../../mocks.js');
const faker = require('faker');
const assert = require('assert');

describe.skip('#Customer Stripe service', () => {

  describe('#Create customer', () => {

    let mockClient = {};

    beforeEach(done => {
      mock.createClient()
      .then(_clients => {
        mockClient.id = _clients[0].id;
        mockClient.email = _clients[0].user;
        mockClient.firstName = faker.name.firstName();
        mockClient.lastName = faker.name.lastName();
        return done();
      })
      .catch(done);
    });

    it('#should return fulfilled', done => {
      CustomerStripeService.create(mockClient.id, mockClient)
      .then(() => {
        Client.findOne({id: mockClient.id})
          .then(_client => {
            assert.equal(new RegExp("cus_").test(_client.customerId), true);
            return done();
          })
          .catch(done);
      })
      .catch(done);
    });

    it('#should return fulfilled and regex test should failed', done => {
      CustomerStripeService.create(mockClient.id, mockClient)
      .then(() => {
        Client.findOne({id: mockClient.id})
          .then(_client => {
            assert.equal(new RegExp("cuz_").test(_client.customerId), false);
            return done();
          })
          .catch(done);
      })
      .catch(done);
    });
  });

  describe('#Destroy customer', () => {

    let mockCustomer;

    beforeEach(done => {
      mock.createCustomer()
      .then(_customer => {
        mockCustomer = _customer[0];
        return done();
      })
      .catch(done);
    });

    it('#should return fulfilled', done => {
      CustomerStripeService.destroy(mockCustomer.id)
      .then(done)
      .catch(done);
    });
  });

  describe('#Update customer', () => {

    let mockCustomer;
    let fakeName = "";

    beforeEach(done => {
      mock.createCustomer()
      .then(_customer => {
        mockCustomer = _customer[0];
        fakeName = faker.name.firstName() + ' ' + faker.name.lastName();
        return done();
      })
      .catch(done);
    });

    it('#should return fulfilled', done => {
      CustomerStripeService.update(
        mockCustomer.id,
        {
          description: fakeName
        }
      )
      .then(_customer => {
        assert.equal(_customer.description, fakeName);
        return done();
      })
      .catch(done);
    });
  });

  describe('#Find one customer', () => {

    let mockCustomer;

    beforeEach(done => {
      mock.createCustomer()
      .then(_customer => {
        mockCustomer = _customer[0];
        return done();
      })
      .catch(done);
    });

    it('#should return fulfilled', done => {
      CustomerStripeService.findOne(mockCustomer.id)
      .then(_customer => {
        assert.notEqual(_customer, {});
        return done();
      })
      .catch(done);
    });
  });

  describe('#Find all customers', () => {

    beforeEach(done => {
      mock.createCustomer(5)
      .then(done())
      .catch(done);
    });

    it('#should return fulfilled', done => {
      CustomerStripeService.find()
      .then(_customers => {
        assert.notEqual(_customers.data.length, 0);
        return done();
      })
      .catch(done);
    });
  });
});
