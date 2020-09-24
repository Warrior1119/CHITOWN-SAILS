'use strict';
const assert = require('chai').assert;
const Building = require('../../../api/models/Building.js');
describe('#Building model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Building);
    });
  });

  describe('#Address field structure', () => {
    it('#address "type" should be a string"', () => {
      assert.equal('string', Building.attributes.address.type);
    });

    it('#address "required" should be true', () => {
      assert.equal(true, Building.attributes.address.required);
    });
  });

  describe('#Name field structure', () => {
    it('#name "type" should be a string"', () => {
      assert.equal('string', Building.attributes.name.type);
    });

    it('#name "required" should be true', () => {
      assert.equal(true, Building.attributes.name.required);
    });
  });

  describe('#Logo field structure', () => {
    it('#logo "type" should be a string"', () => {
      assert.equal('string', Building.attributes.logo.type);
    });
  });

  describe('#Image field structure', () => {
    it('#image "type" should be a string"', () => {
      assert.equal('string', Building.attributes.image.type);
    });
  });

  describe('#Phone field structure', () => {
    it('#phone "type" should be a number"', () => {
      assert.equal('number', Building.attributes.phone.type);
    });

    it('#phone "required" should be true', () => {
      assert.equal(true, Building.attributes.phone.required);
    });
  });

  describe('#postalCode field structure', () => {
    it('#postalCode "columnName" should point to "postal_code"', () => {
      assert.equal('postal_code', Building.attributes.postalCode.columnName);
    });

    it('#postalCode "type" should be a number"', () => {
      assert.equal('number', Building.attributes.postalCode.type);
    });

    it('#postalCode "required" should be true', () => {
      assert.equal(true, Building.attributes.postalCode.required);
    });
  });

  describe('#Code field structure', () => {
    it('#code "type" should be a number"', () => {
      assert.equal('number', Building.attributes.code.type);
    });

    it('#code "required" should be true', () => {
      assert.equal(true, Building.attributes.code.required);
    });
  });

  describe('#Active field structure', () => {
    it('#active "type" should be a boolean"', () => {
      assert.equal('boolean', Building.attributes.active.type);
    });
  });
});
