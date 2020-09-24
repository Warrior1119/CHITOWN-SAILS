'use strict';
const assert = require('chai').assert;
const Trainer = require('../../../api/models/Trainer.js');
describe('#Trainer model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Trainer);
    });
  });

  describe('#User field structure', () => {
    it('#user "columnName" should be a user_email', () => {
      assert.equal('user_email', Trainer.attributes.user.columnName);
    });

    it('#user "model" should point to "user"', () => {
      assert.equal('user', Trainer.attributes.user.model);
    });

    it('#user "required" should be true', () => {
      assert.equal(true, Trainer.attributes.user.required);
    });
  });

  describe('#Gender field structure', () => {
    it('#gender "type" should be a string', () => {
      assert.equal('string', Trainer.attributes.gender.type);
    });

    it('#gender "required" should be true', () => {
      assert.equal(true, Trainer.attributes.gender.required);
    });
  });

  describe('#Phone field structure', () => {
    it('#phone "type" should be a number', () => {
      assert.equal('number', Trainer.attributes.phone.type);
    });

    it('#phone "required" should be true', () => {
      assert.equal(true, Trainer.attributes.phone.required);
    });
  });

  describe('#Services field structure', () => {
    it('#services "collection" should point to trainingtype', () => {
      assert.equal('trainingtype', Trainer.attributes.services.collection);
    });
  });

  describe('#Active field structure', () => {
    it('#active "type" should be a boolean', () => {
      assert.equal('boolean', Trainer.attributes.active.type);
    });

    it('#active "defaultsTo" should be true', () => {
      assert.equal(true, Trainer.attributes.active.defaultsTo);
    });
  });
});
