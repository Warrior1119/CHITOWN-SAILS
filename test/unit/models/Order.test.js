'use strict';

const assert = require('chai').assert;
const Order = require('../../../api/models/Order.js');
describe('#Order model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Order);
    });
  });

  describe('#ProductId field structure', () => {
    it('#productId "columnName" should be a product_id', () => {
      assert.equal('product_id', Order.attributes.productId.columnName);
    });

    it('#productId "model" should point to "shopitem"', () => {
      assert.equal('shopitem', Order.attributes.productId.model);
    });

    it('#productId "required" should be true', () => {
      assert.equal(true, Order.attributes.productId.required);
    });
  });

  describe('#Name field structure', () => {
    it('#name "type" should be a string', () => {
      assert.equal('string', Order.attributes.name.type);
    });

    it('#name "required" should be true', () => {
      assert.equal(true, Order.attributes.name.required);
    });
  });

  describe('#Quantity field structure', () => {
    it('#quantity "type" should be a number', () => {
      assert.equal('number', Order.attributes.quantity.type);
    });

    it('#quantity "required" should be true', () => {
      assert.equal(true, Order.attributes.quantity.required);
    });
  });

  describe('#Cost field structure', () => {
    it('#cost "type" should be a number', () => {
      assert.equal('number', Order.attributes.cost.type);
    });

    it('#cost "required" should be true', () => {
      assert.equal(true, Order.attributes.cost.required);
    });
  });

  describe('#Discount field structure', () => {
    it('#discount "type" should be a number', () => {
      assert.equal('number', Order.attributes.discount.type);
    });

    it('#discount "required" should be true', () => {
      assert.equal(true, Order.attributes.discount.required);
    });
  });

  describe('#BuildingId field structure', () => {
    it('#buildingId "columnName" should be a building_id', () => {
      assert.equal('building_id', Order.attributes.buildingId.columnName);
    });

    it('#buildingId "model" should point to "building"', () => {
      assert.equal('building', Order.attributes.buildingId.model);
    });

    it('#buildingId "required" should be false', () => {
      assert.equal(false, Order.attributes.buildingId.required);
    });
  });

  describe('#TrainerId field structure', () => {
    it('#trainerId "columnName" should be a trainer_id', () => {
      assert.equal('trainer_id', Order.attributes.trainerId.columnName);
    });

    it('#trainerId "model" should point to "trainer"', () => {
      assert.equal('trainer', Order.attributes.trainerId.model);
    });

    it('#trainerId "required" should be false', () => {
      assert.equal(false, Order.attributes.trainerId.required);
    });
  });

  describe('#ClientId field structure', () => {
    it('#clientId "columnName" should be a client_id', () => {
      assert.equal('client_id', Order.attributes.clientId.columnName);
    });

    it('#clientId "model" should point to "client"', () => {
      assert.equal('client', Order.attributes.clientId.model);
    });

    it('#clientId "required" should be true', () => {
      assert.equal(true, Order.attributes.clientId.required);
    });
  });
});
