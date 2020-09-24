'use strict';

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      BookingType.create(data)
        .meta({ fetch: true })
        .then(resolve)
        .catch(reject);
    });
  },

  find (page) {
    return new Promise((resolve, reject) => {
      BookingType.find({})
        .skip(page * 10)
        .limit(10)
        .sort('id DESC')
        .populateAll()
        .then(resolve)
        .catch(reject);
    });
  },

  findByClient (userId) {
    return new Promise((resolve, reject) => {
      let clientBuilding;
      User.findOne({ id: userId })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };

          return Client.findOne({ user: user.email });
        })
        .then(client => {
          if(!client) throw { errCode: 404, message: 'Client not found' };
          if(!client.buildingId) throw { errCode: 403, message: 'You are not building resident' };
          clientBuilding = client.buildingId;

          return BookingType.find({}).populate('buildings');
        })
        .then(types => {
          const _parsedTypes = [];

          for (let type of types)
            for (let building of type.buildings)
              if(building.id === clientBuilding)
                _parsedTypes.push({ id: type.id, name: type.name });

          return resolve(_parsedTypes);
        })
        .catch(reject);

    });
  },

  update (id, data) {
    return new Promise((resolve, reject) => {
      BookingType.findOne({ id: id })
        .then(type => {
          if(!type) throw { errCode: 404, message: 'Booking type not found' };

          return BookingType.update({ id: id }).set({ name: data.name });
        })
        .then(() => {
          return BookingType.replaceCollection(id, 'buildings').members(data.buildings);
        })
        .then(resolve)
        .catch(reject);
    });
  },

  destroy (id) {
    return new Promise((resolve, reject) => {
      BookingType.findOne({ id: id })
        .then(type => {
          if(!type) throw { errCode: 404, message: 'Booking type not found' };

          return BookingType.destroy({ id: id });
        })
        .then(resolve)
        .catch(reject);
    });
  },
};
