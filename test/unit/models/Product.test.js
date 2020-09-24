'use strict';
const assert = require('chai').assert;
const Product = require('../../../api/models/Product.js');

describe('#Product model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Product);
    });
  });

  describe('#ClientId field structure', () => {
    it('#clientId "columnName" should be a client_id', () => {
      assert.equal('client_id', Product.attributes.clientId.columnName);
    });

    it('#clientId "model" should point to "client"', () => {
      assert.equal('client', Product.attributes.clientId.model);
    });

    it('#clientId "required" should be true', () => {
      assert.equal(true, Product.attributes.clientId.required);
    });
  });

  describe('#Quantity field structure', () => {

    it('#quantity "type" should be a number', () => {
      assert.equal('number', Product.attributes.quantity.type);
    });

    it('#quantity "required" should be true', () => {
      assert.equal(true, Product.attributes.quantity.required);
    });
  });

  describe('#ExpDate field structure', () => {

    it('#expDate "type" should be a number', () => {
      assert.equal('number', Product.attributes.expDate.type);
    });
  });

  describe('#Color field structure', () => {

    it('#color "type" should be a string', () => {
      assert.equal('string', Product.attributes.color.type);
    });
  });

  describe('#Icon field structure', () => {

    it('#icon "type" should be a string', () => {
      assert.equal('string', Product.attributes.icon.type);
    });
  });
});
