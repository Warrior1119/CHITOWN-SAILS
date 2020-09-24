'use strict';
const assert = require('chai').assert;
const Measurement = require('../../../api/models/Measurements.js');
describe('#Measurement model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Measurement);
    });
  });

  describe('#ClientId field structure', () => {
    it('#clientId "columnName" should be a client_id', () => {
      assert.equal('client_id', Measurement.attributes.clientId.columnName);
    });

    it('#clientId "model" should point to "client"', () => {
      assert.equal('client', Measurement.attributes.clientId.model);
    });

    it('#clientId "required" should be true', () => {
      assert.equal(true, Measurement.attributes.clientId.required);
    });
  });

  describe('#Weight field structure', () => {
    it('#weight "type" should be a number', () => {
      assert.equal('number', Measurement.attributes.weight.type);
    });

    it('#weight "required" should be true', () => {
      assert.equal(true, Measurement.attributes.weight.required);
    });
  });

  describe('#Height field structure', () => {
    it('#height "type" should be a number', () => {
      assert.equal('number', Measurement.attributes.height.type);
    });

    it('#height "required" should be true', () => {
      assert.equal(true, Measurement.attributes.height.required);
    });
  });

  describe('#Bfp field structure', () => {
    it('#bfp "type" should be a number', () => {
      assert.equal('number', Measurement.attributes.bfp.type);
    });

    it('#bfp "required" should be true', () => {
      assert.equal(true, Measurement.attributes.bfp.required);
    });
  });

  describe('#Waist field structure', () => {
    it('#waist "type" should be a number', () => {
      assert.equal('number', Measurement.attributes.waist.type);
    });

    it('#waist "required" should be true', () => {
      assert.equal(true, Measurement.attributes.waist.required);
    });
  });

  describe('#Hips field structure', () => {
    it('#hips "type" should be a number', () => {
      assert.equal('number', Measurement.attributes.hips.type);
    });

    it('#hips "required" should be true', () => {
      assert.equal(true, Measurement.attributes.hips.required);
    });
  });

  describe('#Cb field structure', () => {
    it('#cb "type" should be a number', () => {
      assert.equal('number', Measurement.attributes.cb.type);
    });

    it('#cb "required" should be true', () => {
      assert.equal(true, Measurement.attributes.cb.required);
    });
  });

  describe('#Thighs field structure', () => {
    it('#thighs "type" should be a number', () => {
      assert.equal('number', Measurement.attributes.thighs.type);
    });

    it('#thighs "required" should be true', () => {
      assert.equal(true, Measurement.attributes.thighs.required);
    });
  });

  describe('#Arms field structure', () => {
    it('#arms "type" should be a number', () => {
      assert.equal('number', Measurement.attributes.arms.type);
    });

    it('#arms "required" should be true', () => {
      assert.equal(true, Measurement.attributes.arms.required);
    });
  });
});
