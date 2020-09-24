'use strict';
const assert = require('chai').assert;
const Manager = require('../../../api/models/Manager.js');
describe('#Manager model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Manager);
    });
  });

  describe('#User field structure', () => {
    it('#user "columnName" should point to "user_email"', () => {
      assert.equal('user_email', Manager.attributes.user.columnName);
    });

    it('#user "model" should point to "user"', () => {
      assert.equal('user', Manager.attributes.user.model);
    });

    it('#user "required" should be true', () => {
      assert.equal(true, Manager.attributes.user.required);
    });
  });
});
