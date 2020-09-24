'use strict';
const faker = require('faker');
const mock = require('./../../mocks.js');
const assert = require('assert');
describe('#User service', () => {

  describe('#Create user', () => {

    let mockUserEmail = "";
    let mockTrainerId;
    let mockBuildingId;

    beforeEach(done => {
      mock.createTrainer()
      .then(trainers => {
        mock.createBuilding()
        .then(buildings => {
          mockBuildingId = buildings[0].id;
          mockTrainerId = trainers[0].id;
          mockUserEmail = faker.internet.email();
          return done();
        })
        .catch(done);
      })
      .catch(done);
    });

    it('#should return fulfilled', done => {
      UserService.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: mockUserEmail,
        password: faker.internet.password(),
        tag: 'Freemium',
        role: 'Client',
        gender: 'Male',
        birth: Date.now(),
        phone: '123123123',
        trainerId: mockTrainerId,
        buildingId: mockBuildingId
      })
      .then(()=> {
        User.findOne({email: mockUserEmail})
          .then(_user => {
            if(!_user) done(new Error("Can't find created user"));
            return done();
          })
          .catch(done);
      })
      .catch(done);
    });
  });

  describe('#Update user', () => {

    let mockClientId;
    let mockClientName;

    beforeEach(done => {
      mock.createClient()
      .then(clients => {
        mockClientId = clients[0].id;
        mockClientName = faker.name.firstName();
        return done();
      })
      .catch(done);
    });

    it('#should return fulfilled with one record in object', done => {
      UserService.update({id: mockClientId, firstName: mockClientName}, 'Client')
      .then(_user=> {
        assert.equal(mockClientName, _user.user.firstName);
        return done();
      })
      .catch(done);
    });
  });
});
