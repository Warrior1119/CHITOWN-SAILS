'use strict';
const mock = require('./../../mocks.js');

describe('#Password service', () => {
  describe('#Remind password', () => {

    let mockClient;

    beforeEach(done => {
      mock.createClient()
      .then(clients => {
        mockClient = clients[0];
        return done();
      })
      .catch(done);
    });

    it('#should return fulfilled with one record in object', done => {
      PasswordService.remind(mockClient.user)
      .then(done)
      .catch(done);
    });
  });
});
