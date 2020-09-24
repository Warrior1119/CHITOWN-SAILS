'use strict';
const assert = require('chai').assert;
const Client = require('../../../api/models/Client.js');

describe('#Client model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Client);
    });
  });

  describe('#User field structure', () => {
    it('#user "columnName" should be a user_email', () => {
      assert.equal('user_email', Client.attributes.user.columnName);
    });

    it('#user "model" should point to "user"', () => {
      assert.equal('user', Client.attributes.user.model);
    });

    it('#user "required" should be true', () => {
      assert.equal(true, Client.attributes.user.required);
    });
  });

  describe('#CustomerId field structure', () => {
    it('#customerId "columnName" should be a user_email', () => {
      assert.equal('customer_id', Client.attributes.customerId.columnName);
    });

    it('#customerId "type" should be a string', () => {
      assert.equal('string', Client.attributes.customerId.type);
    });
  });

  describe('#trainerId field structure', () => {
    it('#trainerId "columnName" should be a trainer_id', () => {
      assert.equal('trainer_id', Client.attributes.trainerId.columnName);
    });

    it('#trainerId "model" should point to "trainerId"', () => {
      assert.equal('trainer', Client.attributes.trainerId.model);
    });

    it('#trainerId "required" should be false', () => {
      assert.equal(false, Client.attributes.trainerId.required);
    });
  });

  describe('#BuildingId field structure', () => {
    it('#buildingId "columnName" should point to "building_id"', () => {
      assert.equal('building_id', Client.attributes.buildingId.columnName);
    });

    it('#buildingId "model" should point to "building"', () => {
      assert.equal('building', Client.attributes.buildingId.model);
    });

    it('#buildingId "required" should be false', () => {
      assert.equal(false, Client.attributes.buildingId.required);
    });
  });

  describe('#tag field structure', () => {
    it('#tag "type" should be a string', () => {
      assert.equal('string', Client.attributes.tag.type);
    });

    it('#tag "required" should be true', () => {
      assert.equal(true, Client.attributes.tag.required);
    });

    it('#tag "isIn" length should return 3', () => {
      assert.equal(3, Client.attributes.tag.isIn.length);
    });

    it('#tag "isIn" should return ["Paying", "Freemium", "Prospect"]', done => {
      const tags =  Client.attributes.tag.isIn;

      if(tags.indexOf('Paying') === -1) done(new Error('Mising tag: "Paying"'));
      else if(tags.indexOf('Freemium') === -1) done(new Error('Mising tag: "Freemium"'));
      else if(tags.indexOf('Prospect') === -1) done(new Error('Mising tag: "Prospect"'));
      else done();
    });
  });

  describe('#Gender field structure', () => {
    it('#gender "type" should be a string', () => {
      assert.equal('string', Client.attributes.gender.type);
    });

    it('#gender "required" should be true', () => {
      assert.equal(true, Client.attributes.gender.required);
    });
  });

  describe('#Phone field structure', () => {
    it('#phone "type" should be a number', () => {
      assert.equal('number', Client.attributes.phone.type);
    });

    it('#phone "required" should be true', () => {
      assert.equal(true, Client.attributes.phone.required);
    });
  });

  describe('#Birth field structure', () => {
    it('#birth "type" should be a number', () => {
      assert.equal('number', Client.attributes.birth.type);
    });

    it('#birth "required" should be true', () => {
      assert.equal(true, Client.attributes.birth.required);
    });
  });

  describe('#Newsletter field structure', () => {
    it('#newsletter "type" should be a boolean', () => {
      assert.equal('boolean', Client.attributes.newsletter.type);
    });
  });

  describe('#Notification field structure', () => {
    it('#notification "type" should be a boolean', () => {
      assert.equal('boolean', Client.attributes.notification.type);
    });
  });

  describe('#FromFacebook field structure', () => {
    it('#fromFacebook "type" should be a boolean', () => {
      assert.equal('boolean', Client.attributes.fromFacebook.type);
    });
  });
});
