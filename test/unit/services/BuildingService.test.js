'use strict';
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');

describe('#Building service', () => {

  describe('Destroy building', () => {

    let mockBuildingId;

    beforeEach(done => {
      mock.createBuilding()
        .then(buildings => {
          mockBuildingId = buildings[0].id;
          return done();
        })
        .catch(done);
    });

    it('#should return fulfilled', done => {
      BuildingService.destroy(mockBuildingId)
        .then(() => {
          Building.findOne({id: mockBuildingId})
            .then(building => {
              if(building) throw Error("Can't destroy building");
              return done();
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  describe('Find buildings', () => {

    let mockBuildingCount = 0;

    beforeEach(done => {
      mock.createBuilding(10)
        .then(data => {
          mockBuildingCount = data.length;
          return done();
        })
         .catch(done);
    });

    it('#should return fulfilled with content', done => {
      BuildingService.find()
        .then(buildings => {
          assert.equal(mockBuildingCount, buildings.length);
          return done();
        })
        .catch(done);
    });
  });

  describe('Find one building by code', () => {

    let mockBuilding;

    beforeEach(done => {
      mock.createBuilding()
        .then(data => {
          mockBuilding = data[0];
          return done();
        })
         .catch(done);
    });

    it('#should return fulfilled without content', done => {
      BuildingService.findOneByCode(mockBuilding.code)
        .then(done())
        .catch(done);
    });
  });
});
