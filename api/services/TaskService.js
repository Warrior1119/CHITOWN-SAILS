'use strict';

module.exports = {
  create (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ email: data.user })
        .then(_user => {
          if(!_user) return reject(400);

          return User.findOne({ id: data.userID });
        })
        .then(_user => {
          if(!_user) return reject(400);

          if(_user.role === 'Administrator') return Administrator.findOne({ user: _user.email });
          else return Manager.findOne({ user: _user.email });
        })
        .then(_manager => {
          if(!_manager) return reject(400);

          data.managerId = _manager.id;
          delete data.userID;

          return Task.create(data).meta({ fetch: true });
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  createTemplate (data) {
    return new Promise((resolve, reject) => {
      Task.create(data)
        .meta({ fetch: true })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  update (id, data) {
    return new Promise((resolve, reject) => {
      Task.update({ id })
        .set(data)
        .meta({ fetch: true })
        .then(_prospectTask => {
          return Task.findOne({ id: _prospectTask[0].id }).populateAll();
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  destroy (id) {
    return new Promise((resolve, reject) => {
      Task.destroy({ id: id })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find (data) {
    return new Promise((resolve, reject) => {
      let criteria = {
        where: { template: false },
        sort: 'id DESC'
      };

      // Use all params
      if(Utilities.isEmail(data.user) && !Utilities.isNumeric(data.category) && Utilities.isNumeric(data.priority) && data.priority !== '0') {
        criteria.where.category = data.category;
        criteria.where.user = data.user;
        criteria.where.priority = data.priority;
      }
      // Use only user and category
      else if(Utilities.isEmail(data.user) && !Utilities.isNumeric(data.category)) {
        criteria.where.category = data.category;
        criteria.where.user = data.user;
      }
      // Use only user and priority
      else if(Utilities.isEmail(data.user) && Utilities.isNumeric(data.priority) && data.priority !== '0') {
        criteria.where.user = data.user;
        criteria.where.priority = data.priority;
      }
      // Use only category and priority
      else if(!Utilities.isNumeric(data.category) && Utilities.isNumeric(data.priority) && data.priority !== '0') {
        criteria.where.category = data.category;
        criteria.where.priority = data.priority;
      }
      else if(Utilities.isEmail(data.user)) criteria.where.user = data.user;
      else if(Utilities.isNumeric(data.priority) && data.priority !== '0') criteria.where.priority = data.priority;
      else if(!Utilities.isNumeric(data.category)) criteria.where.category = data.category;

      criteria.where.date = { '>=': data.start, '<=': data.end };

      Task.find(criteria)
        .populateAll()
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findByTrainer (data) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: data.userID })
        .then(_user => {
          if(!_user) return reject(404);

          data.user = _user.email;

          this.find(data)
            .then(resolve)
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findCategories () {
    return new Promise((resolve, reject) => {
      Task.getDatastore().sendNativeQuery('SELECT category FROM task GROUP BY category ASC')
        .then(categories => {
          return resolve(categories.rows.filter(obj => typeof obj.category === 'string').map(obj => obj.category));
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOne (id) {
    return new Promise((resolve, reject) => {
      Task.findOne({ id })
        .then(_task => {
          if(!_task) return reject(404);

          return resolve(_task);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  generateProspectTask (userEmail) {
    return new Promise((resolve, reject) => {
      Task.find({ template: true })
        .then(_templates => {
          if(!_templates) return reject(404);

          for (let i = 0; i < _templates.length; i++) {
            _templates[i].user = userEmail;
            delete _templates[i].id;
            delete _templates[i].createdAt;
            delete _templates[i].updatedAt;
            delete _templates[i].template;
          }

          return Task.createEach(_templates).meta({ fetch: true }); // TODO: Remove meta
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  dietBought (client) {
    return new Promise(function (resolve, reject) {
      Task.create({
        name: 'Prepare diet for client',
        description: `Your client ${client.user.firstName} ${client.user.firstName} just bought a diet. Upload it for him`,
        category: 'Diets',
        user: client.trainerId.user,
      })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  }
};
