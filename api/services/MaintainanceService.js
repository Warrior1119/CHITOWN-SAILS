'use strict';

module.exports = {
  create (data, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(issuedByUser => {
          if(!issuedByUser) return reject({ errCode: 404, message: 'User not found' });
          if(issuedByUser.role !== 'Client') return reject({ errCode: 403, message: 'This action is allowed only for Client' });
          data.issuedBy = issuedByUser.email;

          return Client.findOne({ user: issuedByUser.email });
        })
        .then(client => {
          if(!client.buildingId) return reject({ errCode: 403, message: 'You are not resident of any building' });

          return Maintainance.create({
            type: data.type,
            issuedBy: data.issuedBy,
            description: data.description,
            buildingId: client.buildingId
          });
        })
        .then(resolve)
        .catch(reject);
    });
  },

  find (page, userID) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userID })
        .then(user => {
          if(!user) return reject({ errCode: 404, message: 'User not found' });

          if (user.role === 'Client') {
            return Client.findOne({ user: user.email }).populate('user');
          } else if (user.role === 'PropertyManager') {
            return PropertyManager.findOne({ user: user.email }).populate('user');
          } else {
            return reject({ errCode: 403, message: 'Access denied' });
          }
        })
        .then(extUser => {
          const criteria = {};
          if(extUser.user.role === 'Client') criteria.issuedBy = extUser.user.email;
          else criteria.buildingId = extUser.buildingId;

          return Maintainance.find(criteria)
            .skip(page * 10)
            .limit(10)
            .sort('id DESC')
            .populateAll();
        })
        .then(resolve)
        .catch(reject);
    });
  },

  setToDone (id, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(user => {
          if(!user) return reject({ errCode: 404, message: 'User not found' });

          return PropertyManager.findOne({ user: user.email });
        })
        .then(propManger => {
          if(!propManger) return reject({ errCode: 404, message: 'Property manager not found' });

          return Maintainance.findOne({ id : id , buildingId: propManger.buildingId });
        })
        .then(notification => {
          if(!notification) return reject({ errCode: 404, message: 'Maintainance not found' });

          return Maintainance.update({ id: id }).set({ done: true }).meta({ fetch: true });
        })
        .then(resolve)
        .catch(reject);
    });
  },
};
