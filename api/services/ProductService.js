'use strict';

module.exports = {
  createOrUpdate (data, req) {
    return new Promise((resolve, reject) => {
      Product.findOne({ clientId: data.clientId, name: data.name, duration: data.duration })
        .then(_product => {
          if(!_product) {

            TrainingType.findOrCreate({
              name: `${data.name} ${data.duration} min`
            },{
              name: `${data.name} ${data.duration} min`,
              duration: data.duration,
              icon: data.icon,
              color: data.color,
              personal: data.personal,
              active: true,
            })
            .then(() => {
              const product = {
                name: `${data.name} ${data.duration} min`,
                productId: data.productId,
                clientId: data.clientId,
                quantity: data.quantity,
                color: data.color,
                icon: data.icon,
                duration: data.duration,
                price: data.price
              };

              var Invoicefilename = data.invoicePath.split('/').pop();
              product.invoicePath = Invoicefilename;
              return Product.create(product)
                .meta({ fetch: true });
            })
            .then(resolve)
            .catch(err => {
              sails.log.error(err);
              return reject();
            });
          } else {
            Product.update({ id: _product.id })
              .set({ quantity: data.quantity + _product.quantity })
              .meta({ fetch: true })
              .then(_product => resolve(_product[0]))
              .catch(err => {
                sails.log.error(err);
                return reject();
              });
          }
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  find (userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject(404);
          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);
          return Product.find({ where: { clientId: _client.id }, sort: 'id DESC' }).populate('productId');
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findByManager (clientId) {
    return new Promise((resolve, reject) => {
      Client.findOne({ id: clientId })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: 'Client not found' };

          return Product.find({ where: { clientId: _client.id }, sort: 'id DESC' }).populate('productId');
        })
        .then(resolve)
        .catch(reject);
    });
  },

  findByTrainer (trainerUserId, clientId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: trainerUserId })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };

          return Trainer.findOne({ user: _user.email });
        })
        .then(_trainer => {
          if(!_trainer) throw { errCode: 404, message: 'Trainer not found' };

          return Client.findOne({ id: clientId, trainerId: _trainer.id });
        })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: 'Client not found' };

          return Product.find({ where: { clientId: _client.id }, sort: 'id DESC' }).populate('productId');
        })
        .then(resolve)
        .catch(reject);
    });
  },

  findOne (id, userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) return reject(404);
          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) return reject(404);
          return Product.findOne({ id: id, clientId: _client.id }).populate('productId');
        })
        .then(_product => {
          if(!_product) return reject(404);
          return resolve(_product);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  addSessions ({ clientId, skuId }) {
    return new Promise((resolve, reject) => {
      Client.findOne({ id: clientId })
        .populateAll()
        .then(client => {
          if(!client) throw { errCode: 400, message: `Client with this id not exist` };

          return Sku.findOne({ id: skuId }).populateAll();
        })
        .then(sku => {
          if(!sku) throw { errCode: 400, message: 'Sku with this id not exist' };

          return this.createOrUpdate({
            clientId: clientId,
            productId: sku.productId.id,
            name: `${sku.productId.name}`,
            quantity: sku.quantity,
            duration: sku.duration
          });
        })
        .then(resolve)
        .catch(reject);
    });
  }
};
