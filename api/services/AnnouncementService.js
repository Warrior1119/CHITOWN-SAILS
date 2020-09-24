'use strict';

module.exports = {
  create (data, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(issuedByUser => {
          if(!issuedByUser) throw { errCode: 404, message: 'User not found' };

          data.active = false;
          data.issuedBy = issuedByUser.email;
          if(issuedByUser.role === 'PropertyManager')
            return PropertyManager.findOne({ user: issuedByUser.email })
              .then(propManger => {
                data.buildingId = propManger.buildingId;
                return data;
              })
              .catch(reject);
          return ;
        })
        .then(() => Announcement.create(data).meta({ fetch: true }))
        .then(resolve)
        .catch(reject);
    });
  },

  find (page, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };

          if(user.role === 'PropertyManager') {
            PropertyManager.findOne({ user: user.email })
              .then(propManger => Announcement
                .find({ buildingId: propManger.buildingId })
                .skip(page * 10)
                .limit(10)
                .sort('id DESC')
                .populateAll())
              .then(resolve)
              .catch(reject);
          } else {
            Announcement
              .find({ buildingId: null })
              .skip(page * 10)
              .limit(10)
              .sort('id DESC')
              .populateAll()
              .then(resolve)
              .catch(reject);
          }
        })
        .catch(reject);
    });
  },

  findByClient (userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };

          return Client.findOne({ user: user.email });
        })
        .then(client => {
          if(!client) throw { errCode: 404, message: 'Client not found' };

          return Announcement.findOne({ buildingId: client.buildingId, active: true });
        })
        .then(announcement => {
          if(announcement) return resolve(announcement);

          return Announcement.findOne({ buildingId: null, active: true });
        })
        .then(announcement => {
          if(!announcement) throw { errCode: 404, message: 'There is no announcements' };

          return resolve(announcement);
        })
        .catch(reject);

    });
  },

  update (id, userId) {
    return new Promise((resolve, reject) => {
      let _user;
      let _announcement;

      User.findOne({ id: userId })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };
          _user = user;

          if(user.role === 'PropertyManager')
            return Announcement.findOne({ id: id, issuedBy: _user.email });
          else
            return Announcement.findOne({ id: id, buildingId: null });
        })
        .then(announcement => {
          if(!announcement) throw { errCode: 404, message: 'Announcement not found' };
          _announcement = announcement;

          if(_user.role === 'PropertyManager')
            return Announcement.findOne({ issuedBy: _user.email, active: true });
          else
            return Announcement.findOne({ buildingId: null, active: true });
        })
        .then(announcement => {
          if(announcement && !_announcement.active) throw { errCode: 403, message: 'You can have only one active announcement at one time. Please deactivate previous before activating this' };

          return Announcement.update({ id: id }).set({ active: !_announcement.active });
        })
        .then(resolve)
        .catch(reject);
    });
  },

  destroy (id, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(user => {
          if(!user) throw { errCode: 404, message: 'User not found' };

          return Announcement.destroy({ id: id, issuedBy: user.email });
        })
        .then(resolve)
        .catch(reject);
    });
  },
};
