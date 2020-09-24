'use strict';
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Charge Stripe service', () => {

  describe('#Charge customer', () => {

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
      ChargeStripeService.create({customerID: mockCustomer.id, amount: 2000})
      .then(_charge => {
        assert.equal(_charge.amount, 2000);
        return done();
      })
      .catch(done);
    });
  });

  describe('#Find customer charges', () => {

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
      ChargeStripeService.findCustomerCharges(mockCustomer.id)
      .then(_charges => {
        assert.notEqual(_charges, {});
        return done();
      })
      .catch(done);
    });
  });

  describe('#Find all charges', () => {

    beforeEach(done => {
      mock.createCustomer()
      .then(() => done())
      .catch(done);
    });

    it('#should return fulfilled', done => {
      ChargeStripeService.find('2016-07-28')
      .then(_charges => {
        assert.notEqual(_charges.data.length, 0);
        return done();
      })
      .catch(done);
    });
  });

  describe('#Find one charge', () => {

    let mockCharge;

    beforeEach(done => {
      mock.chargeCustomer()
      .then(_charge =>  {
        mockCharge = _charge;
        return done();
      })
      .catch(done);
    });

    it('#should return fulfilled with charge object', done => {
      ChargeStripeService.findOne(mockCharge.id)
      .then(_charge => {
        assert.equal(_charge.id, mockCharge.id);
        return done();
      })
      .catch(done);
    });
  });
});
