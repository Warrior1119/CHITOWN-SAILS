'use strict';
const assert = require('chai').assert;
const Training = require('../../../api/models/Training.js');
describe('#Training model structure', () => {

  describe('#Model structure', () => {
    it('#should return model object', () => {
      assert.equal('object', typeof Training);
    });
  });

  describe('#Name field structure', () => {
    it('#name "type" should be a string', () => {
      assert.equal('string', Training.attributes.name.type);
    });

    it('#name "required" should be true', () => {
      assert.equal(true, Training.attributes.name.required);
    });
  });

  describe('#Date field structure', () => {
    it('#date "type" should be a number', () => {
      assert.equal('number', Training.attributes.date.type);
    });

    it('#date "required" should be true', () => {
      assert.equal(true, Training.attributes.date.required);
    });
  });

  describe('#TrainerId field structure', () => {
    it('#trainerId "columnName" should be a trainer_id', () => {
      assert.equal('trainer_id', Training.attributes.trainerId.columnName);
    });

    it('#trainerId "model" should point to "trainer"', () => {
      assert.equal('trainer', Training.attributes.trainerId.model);
    });

    it('#trainerId "required" should be true', () => {
      assert.equal(true, Training.attributes.trainerId.required);
    });
  });

  describe('#MainClient field structure', () => {
    it('#mainClient "columnName" should be a main_client', () => {
      assert.equal('main_client', Training.attributes.mainClient.columnName);
    });

    it('#mainClient "model" should point to "client"', () => {
      assert.equal('client', Training.attributes.mainClient.model);
    });

    it('#mainClient "required" should be true', () => {
      assert.equal(false, Training.attributes.mainClient.required);
    });
  });

  describe('#Clients field structure', () => {
    it('#clients "collection" should point to "client"', () => {
      assert.equal('client', Training.attributes.clients.collection);
    });
  });

  describe('#Duration field structure', () => {
    it('#duration "type" should be a number', () => {
      assert.equal('number', Training.attributes.duration.type);
    });

    it('#duration "required" should be true', () => {
      assert.equal(true, Training.attributes.duration.required);
    });
  });

  describe('#Type field structure', () => {
    it('#type "model" should point to "trainingtype"', () => {
      assert.equal('trainingtype', Training.attributes.type.model);
    });

    it('#type "required" should be true', () => {
      assert.equal(true, Training.attributes.type.required);
    });
  });

  describe('#Cost field structure', () => {
    it('#cost "type" should be a number', () => {
      assert.equal('number', Training.attributes.cost.type);
    });

    it('#cost "required" should be true', () => {
      assert.equal(true, Training.attributes.cost.required);
    });
  });

  describe('#Capacity field structure', () => {
    it('#capacity "type" should be a number', () => {
      assert.equal('number', Training.attributes.capacity.type);
    });

    it('#capacity "defaultsTo" should be 1', () => {
      assert.equal(1, Training.attributes.capacity.defaultsTo);
    });
  });

  describe('#BuildingId field structure', () => {
    it('#buildingId "columnName" should be a building_id', () => {
      assert.equal('building_id', Training.attributes.buildingId.columnName);
    });

    it('#buildingId "model" should point to "building"', () => {
      assert.equal('building', Training.attributes.buildingId.model);
    });

    it('#buildingId "required" should be false', () => {
      assert.equal(false, Training.attributes.buildingId.required);
    });
  });

  describe('#Canceled field structure', () => {
    it('#canceled "type" should be a boolean', () => {
      assert.equal('boolean', Training.attributes.canceled.type);
    });

    it('#canceled "defaultsTo" should be 0', () => {
      assert.equal(0, Training.attributes.canceled.defaultsTo);
    });
  });

  describe('#Event field structure', () => {
    it('#event "type" should be a boolean', () => {
      assert.equal('boolean', Training.attributes.event.type);
    });

    it('#event "defaultsTo" should be 0', () => {
      assert.equal(0, Training.attributes.event.defaultsTo);
    });
  });


  describe('#trainerCost field structure', () => {
    it('#trainerCost "columnName" should be a trainer_cost', () => {
      assert.equal('trainer_cost', Training.attributes.trainerCost.columnName);
    });

    it('#trainerCost "type" should be a number', () => {
      assert.equal('number', Training.attributes.trainerCost.type);
    });

    it('#trainerCost "required" should be true', () => {
      assert.equal(true, Training.attributes.trainerCost.required);
    });
  });
});
