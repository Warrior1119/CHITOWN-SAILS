'use strict';

const admin = require('firebase-admin');
const serviceAccount = require('../../config/chitown-firebase.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

function sendWeb (message, topic, title) {
  return new Promise(function (resolve, reject) {
    admin.messaging().send({ notification: { title: title, body: message }, topic: topic })
      .then(() => resolve())
      .catch(reject);
  });
}

module.exports = {
  sendMessage (sentThrough, message, buildingId, title, file) {
    return new Promise((resolve, reject) => {
      let topic = 'all';
      if(buildingId) topic = 'building' + buildingId;

      switch (sentThrough) {
        case 'Email':
          Promise.resolve()
            .then(() => {
              if(!buildingId) return Client.find();

              return Client.find({ buildingId: buildingId });
            })
            .then(clients => {
              return EmailService.sendAnnouncement(clients.map(client => client.user), message, title, file);
            })
            .then(resolve)
            .catch(reject);
          break;
        case 'Web':
          sendWeb(message, topic, title).then(resolve).catch(reject);
          break;
        case 'Email and Web':
          sendWeb(message, topic, title)
            .then(() => {
              if(!buildingId) return Client.find();

              return Client.find({ buildingId: buildingId });
            })
            .then(clients => {
              return EmailService.sendAnnouncement(clients.map(client => client.user), message, title, file);
            })
            .then(resolve)
            .catch(reject);
          break;
        default:
          return reject({ errCode: 400, message: 'Bad value of sentThrough' });
      }
    });
  },

  create (data, req) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: req.token.userID })
        .then(issuedByUser => {
          if(!issuedByUser) return reject({ errCode: 404, message: 'User not found' });
          data.issuedBy = issuedByUser.email;

          const images = [{ file: req.file('image'), dir: './opt/notification_images/'}];
          UploadService.uploadMany(images)
          .then(_files => {
            if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');

            if(data.buildingId) { // if it's personal notification
            Building.findOne({ id: data.buildingId })
              .then(building => {
                if(!building) return reject({ errCode: 404, message: 'You can not send notification to non-existing building' });

                const obj = {
                  type: data.type,
                  title: data.title,
                  sentThrough: data.sentThrough,
                  issuedBy: data.issuedBy,
                  buildingId: data.buildingId,
                  description: data.description,
                  image: data.image,
                };

                if(data.file) obj.file = data.file;
                return Notification.create(obj);
              })
              .then(() => {
                return this.sendMessage(data.sentThrough, data.description, data.buildingId, data.title, data.file);
              })
              .then(resolve)
              .catch(reject);
          } else {
            const obj = {
              type: data.type,
              title: data.title,
              sentThrough: data.sentThrough,
              issuedBy: data.issuedBy,
              description: data.description,
              image: data.image
            };
              if(data.file) obj.file = data.file;
              Notification.create(obj)
                .then(() => {
                  return this.sendMessage(data.sentThrough, data.description, undefined, data.title, data.file);
                })
                .then(resolve)
                .catch(reject);
            }
          })
          .catch(reject);
        })
        .catch(reject);
    });
  },

  createByPropertyManager (data, userId) {
    return new Promise((resolve, reject) => {
      let propManager;
      let clientUser;
      User.findOne({ id: userId })
        .then(issuedByUser => {
          if(!issuedByUser) return reject({ errCode: 404, message: 'User not found' });

          return PropertyManager.findOne({ user: issuedByUser.email });
        })
        .then(propertyManager => {
          propManager = propertyManager;

          if(data.issuedTo) {
            Client.findOne({ user: data.issuedTo })
              .populate('user')
              .then(client => {
                clientUser = client.user;

                if(!client) return reject({ errCode: 404, message: 'Client not found' });
                if(client.buildingId !== propManager.buildingId) return reject({ errCode: 403, message: 'You can only notify users from your building' });

                const obj = {
                  type: data.type,
                  title: data.title,
                  sentThrough: data.sentThrough,
                  description: data.description,
                  issuedTo: data.issuedTo,
                  issuedBy: propManager.user,
                  pickedUp: false,
                  read: false
                };

                if(data.file) obj.file = data.file;
                return Notification.create(obj);
              })
              .then(() => {
                return EmailService.personalNotification(data.issuedTo, data.description, data.title, clientUser.firstName);
              })
              .then(resolve)
              .catch(reject);
          } else {
            const obj = {
              type: data.type,
              title: data.title,
              sentThrough: data.sentThrough,
              description: data.description,
              issuedBy: propManager.user,
              buildingId: propManager.buildingId
            };

            if(data.file) obj.file = data.file;
            return Notification.create(obj)
              .then(() => {
                return this.sendMessage(data.sentThrough, data.description, propManager.buildingId, data.title);
              })
              .then(resolve)
              .catch(reject);
          }
        })
        .catch(reject);
    });
  },

  find (type, page) {
    return new Promise((resolve, reject) => {
      if (!page) {
        Notification.find({
          or : [
            { type: 'All' },
            { type: 'Building' }
          ]
        })
          .sort('id DESC')
          .populateAll()
          .then(resolve)
          .catch(reject);
      } else {
        Notification.find({
          or : [
            { type: 'All' },
            { type: 'Building' }
          ]
        })
        .skip(page * 10)
        .limit(10)
        .sort('id DESC')
        .populateAll()
        .then(resolve)
        .catch(reject);
      }
    });
  },

  findByClient (type, page, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(user => {
          if(!user) return reject({ errCode: 404, message: 'User not found' });

          return Client.findOne({ user: user.email });
        })
        .then(client => {
          if(!client) return reject({ errCode: 404, message: 'Client not found' });

          let criteria = {
            or: [
              { type: 'All' },
              { type: 'Building', buildingId: client.buildingId }
            ],
          };

          if(type === 'Pack') {
            criteria = {
              type: 'User',
              issuedTo: client.user
            };
          }

          return Notification.find(criteria)
            .skip(page * 10)
            .limit(10)
            .sort('id DESC')
            .populateAll();
        })
        .then(resolve)
        .catch(reject);

    });
  },

  findByPropManager (type, page, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(user => {
          if(!user) return reject({ errCode: 404, message: 'User not found' });

          return PropertyManager.findOne({ user: user.email });
        })
        .then(propManger => {
          if(!propManger) return reject({ errCode: 404, message: 'Property manager not found' });

          let criteria = {
            or: [
              { type: 'All' },
              { type: 'Building', buildingId: propManger.buildingId }
            ],
          };

          if(type === 'Pack') {
            criteria = {
              type: 'User',
              issuedBy: propManger.user
            };
          }

          return Notification.find(criteria)
            .skip(page * 10)
            .limit(10)
            .sort('id DESC')
            .populateAll();
        })
        .then(resolve)
        .catch(reject);
    });
  },

  updateByClient (id, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(user => {
          if(!user) return reject({ errCode: 404, message: 'User not found' });

          return Client.findOne({ user: user.email });
        })
        .then(client => {
          if(!client) return reject({ errCode: 404, message: 'Client not found' });

          return Notification.findOne({ id: id, issuedTo: client.user, type: 'User' });
        })
        .then(notification => {
          if(!notification) return reject({ errCode: 404, message: 'Notification not found' });

          return Notification.update({ id: id }).set({ read: true });
        })
        .then(resolve)
        .catch(reject);
    });
  },

  updateByPropertyManager (id, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(user => {
          if(!user) return reject({ errCode: 404, message: 'User not found' });

          return PropertyManager.findOne({ user: user.email });
        })
        .then(propManger => {
          if(!propManger) return reject({ errCode: 404, message: 'Property manager not found' });

          return Notification.findOne({ id : id , issuedBy: propManger.user, type: 'User' });
        })
        .then(notification => {
          if(!notification) return reject({ errCode: 404, message: 'Notification not found' });

          return Notification.update({ id: id }).set({ pickedUp: true });
        })
        .then(resolve)
        .catch(reject);
    });
  },
};
