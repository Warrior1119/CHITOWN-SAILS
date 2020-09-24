'use strict';
const assert = require('chai').assert;
const User = require('../../../api/models/User.js');
describe('#User model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof User);
    });

    it('#primaryKey should be email', () => {
      assert.equal('email', User.primaryKey);
    });
  });

  describe('#Email field structure', () => {
    it('#email "type" should be a string', () => {
      assert.equal('string', User.attributes.email.type);
    });

    it('#email "required" should be true', () => {
      assert.equal(true, User.attributes.email.required);
    });
  });

  describe('#firstName field structure', () => {
    it('#firstName "columnName" should be a first_name', () => {
      assert.equal('first_name', User.attributes.firstName.columnName);
    });

    it('#firstName "type" should be a string', () => {
      assert.equal('string', User.attributes.firstName.type);
    });

    it('#firstName "required" should be true', () => {
      assert.equal(true, User.attributes.firstName.required);
    });
  });

  describe('#lastName field structure', () => {
    it('#lastName "columnName" should be a last_name', () => {
      assert.equal('last_name', User.attributes.lastName.columnName);
    });

    it('#lastName "type" should be a string', () => {
      assert.equal('string', User.attributes.lastName.type);
    });

    it('#lastName "required" should be true', () => {
      assert.equal(true, User.attributes.lastName.required);
    });
  });

  describe('#password field structure', () => {
    it('#password "type" should be a string', () => {
      assert.equal('string', User.attributes.password.type);
    });

    it('#password "required" should be true', () => {
      assert.equal(true, User.attributes.password.required);
    });
  });

  describe('#role field structure', () => {
    it('#role "type" should be a string', () => {
      assert.equal('string', User.attributes.role.type);
    });

    it('#role "required" should be true', () => {
      assert.equal(true, User.attributes.role.required);
    });

    it('#role "isIn" length should return 4', () => {
      assert.equal(4, User.attributes.role.isIn.length);
    });

    it('#role "isIn" should return ["Client", "Trainer", "Manager", "Administrator"]', done => {
      const roles =  User.attributes.role.isIn;

      if(roles.indexOf('Client') === -1) done(new Error('Mising role: "Client"'));
      else if(roles.indexOf('Trainer') === -1) done(new Error('Mising role: "Trainer"'));
      else if(roles.indexOf('Manager') === -1) done(new Error('Mising role: "Manager"'));
      else if(roles.indexOf('Administrator') === -1) done(new Error('Mising role: "Administrator"'));
      else done();
    });
  });

  describe('#isActive field structure', () => {
    it('#isActive "columnName" should be a is_active', () => {
      assert.equal('is_active', User.attributes.isActive.columnName);
    });

    it('#isActive "type" should be a boolean', () => {
      assert.equal('boolean', User.attributes.isActive.type);
    });

    it('#isActive "defaultsTo" should be true', () => {
      assert.equal(true, User.attributes.isActive.defaultsTo);
    });
  });

  describe('#Avatar field structure', () => {
    it('#avatar "type" should be a string', () => {
      assert.equal('string', User.attributes.avatar.type);
    });

    it('#avatar "defaultsTo" should be a path to default avatar file', () => {
      assert.equal('opt/default/avatar.png', User.attributes.avatar.defaultsTo);
    });
  });
});
