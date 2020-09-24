'use strict';
const mock = require('./../../mocks.js');
const assert = require('assert');
describe('#Client service', () => {
  describe('#Find one client', () => {

    let mockClientId;

    beforeEach(done => {
      mock.createClient()
      .then(clients => {
        mockClientId = clients[0].id;
        return done();
      })
      .catch(done);
    });

    it('#should return fulfilled with one record in object', done => {
      ClientService.findOne(mockClientId)
      .then(_client=> {
        assert.equal(mockClientId, _client.id);
        return done();
      })
      .catch(done);
    });
  });

  describe('#Find clients', () => {
    beforeEach(done => {
      mock.createClient(5)
      .then(() => done())
      .catch(done);
    });

    it('#should return fulfilled with 3 records', done => {
      ClientService.find({start: 2, end: 4})
      .then(_clients => {
        assert.equal(_clients.length, 3);
        return done();
      })
      .catch(done);
    });
  });
});
