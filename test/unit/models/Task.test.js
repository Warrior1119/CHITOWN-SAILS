'use strict';
const assert = require('chai').assert;
const Task = require('../../../api/models/Task.js');

describe('#Task model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Task);
    });
  });

  describe('#Name field structure', () => {
    it('#name "type" should be a string', () => {
      assert.equal('string', Task.attributes.name.type);
    });

    it('#name "required" should be true', () => {
      assert.equal(true, Task.attributes.name.required);
    });
  });

  describe('#Description field structure', () => {
    it('#description "type" should be a string', () => {
      assert.equal('string', Task.attributes.description.type);
    });

    it('#description "required" should be true', () => {
      assert.equal(true, Task.attributes.description.required);
    });
  });

  describe('#ManagerId field structure', () => {
    it('#managerId "columnName" should ne a manager_id', () => {
      assert.equal('manager_id', Task.attributes.managerId.columnName);
    });

    it('#managerId "model" should point to "manager"', () => {
      assert.equal('manager', Task.attributes.managerId.model);
    });

    it('#managerId "required" should be false', () => {
      assert.equal(false, Task.attributes.managerId.required);
    });
  });

  describe('#User field structure', () => {
    it('#user "columnName" should be a user_email', () => {
      assert.equal('user_email', Task.attributes.user.columnName);
    });

    it('#user "model" should point to "user"', () => {
      assert.equal('user', Task.attributes.user.model);
    });

    it('#user "required" should be true', () => {
      assert.equal(true, Task.attributes.user.required);
    });
  });

  describe('#Done field structure', () => {
    it('#done "type" should be a boolean', () => {
      assert.equal('boolean', Task.attributes.done.type);
    });

    it('#done "defaultsTo" should be false', () => {
      assert.equal(false, Task.attributes.done.defaultsTo);
    });
  });
});
