'use strict';

module.exports = {
  create (data, userID) {
    return new Promise((resolve, reject) => {
      let _client;
      BookingType.findOne({ id: data.typeId })
        .then(type => {
          if(!type) throw { errCode: 404, message: 'Booking type not found' };

          data.type = type.name;

          return User.findOne({ id: userID });
        })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };

          return Client.findOne({ user: user.email }).populateAll();
        })
        .then(client => {
          if(!client) throw { errCode: 404, message: 'Client not found' };

          _client = client;

          return Promise.all([
            Administrator.find({}),
            Manager.find({})
          ]);
        })
        .then(([ admins, managers ]) => {
          if(!admins.length || !managers.length) throw { errCode: 400, message: 'Request can not be done' };

          const emails = (admins.map(x => x.user)).concat(managers.map(x => x.user));
          return EmailService.bookService(emails, {
            name: `${_client.user.firstName} ${_client.user.lastName}`,
            email: `${_client.user.email}`,
            phone: `${_client.phone}`,
            address: `${_client.street} ${_client.apartment} ${_client.zipCode}`,
            buildingName: `${_client.buildingId.name}`,
            serviceName: data.type,
            date: `${new Date(parseInt(data.date))}`,
            message: `${data.message}`
          });
        })
        .then(resolve)
        .catch(reject);
    });
  }
};
