'use strict';
const assert = require('chai').assert;
const Administrator = require('../../../api/models/Administrator.js');
describe('#Administrator model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Administrator);
    });
  });

  describe('#user field structure', () => {
    it('#user "columnName" should user_email', () => {
      assert.equal('user_email', Administrator.attributes.user.columnName);
    });

    it('#user "model" should point to "user"', () => {
      assert.equal('user', Administrator.attributes.user.model);
    });

    it('#user "required" shoud be true', () => {
      assert.equal(true, Administrator.attributes.user.required);
    });
  });
});
