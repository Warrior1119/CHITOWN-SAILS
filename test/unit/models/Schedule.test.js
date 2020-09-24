'use strict';
const assert = require('chai').assert;
const Schedule = require('../../../api/models/Schedule.js');
describe('#Schedule model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Schedule);
    });
  });

  describe('#ClientId field structure', () => {
    it('#clientId "columnName" should be a client_id', () => {
      assert.equal('client_id', Schedule.attributes.clientId.columnName);
    });

    it('#clientId "model" should point to "client"', () => {
      assert.equal('client', Schedule.attributes.clientId.model);
    });

    it('#clientId "required" should be true', () => {
      assert.equal(true, Schedule.attributes.clientId.required);
    });
  });

  describe('#Date field structure', () => {
    it('#date "type" should be a number', () => {
      assert.equal('number', Schedule.attributes.date.type);
    });

    it('#date "required" should be true', () => {
      assert.equal(true, Schedule.attributes.date.required);
    });
  });

  describe('#TrainingId field structure', () => {
    it('#trainingId "columnName" should be a training_id', () => {
      assert.equal('training_id', Schedule.attributes.trainingId.columnName);
    });

    it('#trainingId "model" should point to "training"', () => {
      assert.equal('training', Schedule.attributes.trainingId.model);
    });

    it('#trainingId "required" should be true', () => {
      assert.equal(true, Schedule.attributes.trainingId.required);
    });
  });
});
