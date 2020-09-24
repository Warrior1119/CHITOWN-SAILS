'use strict';
const assert = require('chai').assert;
const TrainingType = require('../../../api/models/TrainingType.js');

describe('#TrainingType model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof TrainingType);
    });
  });

  describe('#Name field structure', () => {
    it('#name "type" should be a string', () => {
      assert.equal('string', TrainingType.attributes.name.type);
    });

    it('#name "required" should be true', () => {
      assert.equal(true, TrainingType.attributes.name.required);
    });
  });

  describe('#Color field structure', () => {

    it('#color "type" should be a string', () => {
      assert.equal('string', TrainingType.attributes.color.type);
    });
  });

  describe('#Icon field structure', () => {

    it('#icon "type" should be a string', () => {
      assert.equal('string', TrainingType.attributes.icon.type);
    });
  });
});
