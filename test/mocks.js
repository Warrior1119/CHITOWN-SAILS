'use strict';
const faker = require('faker');
const supertest = require('supertest');
const redis = require("redis");
const crypto = require("crypto");
const redisHost = process.env.NODE_ENV === 'travis' ? 'localhost' : 'redis';
const stripe = require('stripe')('sk_test_jlFJlmWJlW45r7VtBQ4FbIjp');
const client = redis.createClient({host: redisHost});
stripe.setApiVersion('2017-06-05');
client.on("error", function (err) {
  sails.log.error(err);
});

module.exports = {
  createBuilding(createTimes) {
    return new Promise((resolve, reject) => {
      Building.destroy({})
      .then(() => {

        let mocksContainer = [];

        async.times(createTimes || 1, function(n, next) {
          Building.create({
            address: faker.address.city(),
            name: faker.company.companyName(),
            code: faker.random.number(),
            phone: faker.random.number(),
            postalCode: faker.random.number(),
            image: faker.system.fileName(),
            logo: faker.system.fileName()
          })
               .meta({fetch: true})
               .then(data => {
                 mocksContainer.push(data);
                 next();
               })
               .catch(next);
        }, err => {
          if(err) throw Error("Can't create mocks");

          return resolve(mocksContainer);
        });
      })
      .catch(reject);
    });
  },

  createTrainer(createTimes) {
    return new Promise((resolve, reject) => {

      let mocksContainer = [];

      async.times(createTimes || 1, function(n, next) {
        User.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: 'Trainer'
        })
           .meta({fetch: true})
           .then(_user => {
             Trainer.create({
               user: _user.email,
               gender: 'Male',
               phone: faker.random.number()
             })
              .meta({fetch: true})
              .then(_trainer => {
                mocksContainer.push(_trainer);
                next();
              })
              .catch(next);
           })
           .catch(next);
      }, err => {
        if(err) return reject(err);
        return resolve(mocksContainer);
      });
    });
  },

  createClient(createTimes) {
    return new Promise((resolve, reject) => {
      let mockTrainerId;
      let mockBuildingId;
      let mocksContainer = [];
      User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'Trainer'
      })
         .meta({fetch: true})
         .then(_user => {
           Trainer.create({user: _user.email,gender: 'Male', phone: faker.random.number()})
            .meta({fetch: true})
            .then(_trainer => {
              mockTrainerId = _trainer.id;

              Building.create({
                address: faker.address.city(),
                name: faker.company.companyName(),
                code: faker.random.number(),
                phone: faker.random.number(),
                postalCode: faker.random.number(),
                image: faker.system.fileName(),
                logo: faker.system.fileName()
              })
                   .meta({fetch: true})
                   .then(_building => {
                     mockBuildingId = _building.id;

                     async.times(createTimes || 1, function(n, next) {

                       const userPassword = faker.internet.password();
                       User.create({
                         firstName: faker.name.firstName(),
                         lastName: faker.name.lastName(),
                         email: faker.internet.email(),
                         password: userPassword,
                         role: 'Client'
                       })
                        .meta({fetch: true})
                        .then(_user => {

                          Client.create({
                            user: _user.email,
                            trainerId: mockTrainerId,
                            buildingId: mockBuildingId,
                            gender: 'Male',
                            birth: Date.now(),
                            phone: '123123123',
                            tag: 'Freemium'
                          })
                           .meta({fetch: true})
                           .then(_client => {
                             _client.plainTextPassword = userPassword;
                             mocksContainer.push(_client);
                             next();
                           })
                           .catch(next);
                        })
                        .catch(next);
                     }, err => {
                       if(err) throw Error(err);

                       return resolve(mocksContainer);
                     });
                   })
                   .catch(reject);
            })
            .catch(reject);
         })
         .catch(reject);
    });
  },

  createManager(createTimes) {
    return new Promise((resolve, reject) => {

      let mocksContainer = [];

      async.times(createTimes || 1, function(n, next) {
        User.create({
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: 'Manager'
        })
           .meta({fetch: true})
           .then(_user => {

             Manager.create({user: _user.email})
              .meta({fetch: true})
              .then(_manager => {
                mocksContainer.push(_manager);
                next();
              })
              .catch(next);
           })
           .catch(next);
      }, err => {
        if(err) return reject(err);
        return resolve(mocksContainer);
      });
    });
  },

  createSession(role) {
    return new Promise((resolve, reject) => {
      const userPassword = faker.internet.password();

      User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: userPassword,
        role: role || 'Administrator'
      })
       .meta({fetch: true})
       .then(_user => {

         Administrator.create({user: _user.email})
          .meta({fetch: true})
          .then(_admin => {

            supertest(sails.hooks.http.app)
             .post('/session')
             .send({email: _admin.user, password: userPassword})
             .expect(201)
             .end((err, res) => {
               if(err) return reject(err);
               return resolve(res.body);
             });
          })
          .catch(reject);
       })
       .catch(reject);
    });
  },

  createClientSession(returnClientID) {
    return new Promise((resolve, reject) => {
      let mockTrainerId;
      let mockBuildingId;
      let userPassword;

      User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'Trainer'
      })
            .meta({fetch: true})
        .then(_user => {
          return Trainer.create({
            user: _user.email,
            gender: 'Male',
            phone: faker.random.number()
          })
                .meta({fetch: true});
        })
        .then(_trainer => {
          mockTrainerId = _trainer.id;

          return Building.create({
            address: faker.address.city(),
            name: faker.company.companyName(),
            code: faker.random.number(),
            phone: faker.random.number(),
            postalCode: faker.random.number(),
            image: faker.system.fileName(),
            logo: faker.system.fileName()
          })
                .meta({fetch: true});
        })
        .then(_building => {
          mockBuildingId = _building.id;

          userPassword = faker.internet.password();

          return User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: userPassword,
            role: 'Client'
          })
                .meta({fetch: true});
        })
        .then(_user => {

          return Client.create({
            user: _user.email,
            trainerId: mockTrainerId,
            buildingId: mockBuildingId,
            gender: 'Male',
            birth: Date.now(),
            phone: '123123123',
            tag: 'Freemium'
          })
                .meta({fetch: true});
        })
        .then(_client => {
          supertest(sails.hooks.http.app)
                .post('/session')
                .send({email: _client.user, password: userPassword})
                .expect(201)
                .end((err, res) => {
                  if (err) return reject(err);
                  if (returnClientID) {
                    return resolve({
                      client: _client,
                      session: res.body
                    });
                  }
                  return resolve(res.body);
                });
        })
        .catch(reject);
    });
  },

  createTrainerSession(returnTrainerID) {
    return new Promise((resolve, reject) => {
      let userPassword = faker.internet.password();

      User.create({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: userPassword,
        role: 'Trainer'
      })
            .meta({fetch: true})
        .then(_user => {
          return Trainer.create({
            user: _user.email,
            gender: 'Male',
            phone: faker.random.number()
          })
          .meta({fetch: true});
        })
        .then(_trainer => {
          supertest(sails.hooks.http.app)
            .post('/session')
            .send({email: _trainer.user, password: userPassword})
            .expect(201)
            .end((err, res) => {
              if (err) return reject(err);
              if (returnTrainerID) {
                return resolve({
                  trainer: _trainer,
                  session: res.body
                });
              } else {
                return resolve(res.body);
              }
            });
        })
        .catch(reject);
    });
  },

  createCustomer(createTimes) {
    return new Promise((resolve, reject) => {

      let mocksContainer = [];

      async.times(createTimes || 1, (n, next) => {
        this.createClient()
        .then(_clients => {
          stripe.tokens.create({
            card: {
              "number": '4242 4242 4242 4242',
              "exp_month": 12,
              "exp_year": 2020,
              "cvc": '123'
            }
          }, (err, token) => {
            if(err) return reject();
            stripe.customers.create({
              description: faker.name.firstName() + ' ' + faker.name.lastName(),
              email: _clients[0].user,
              source: token.id
            }, (err, customer) => {
              if(err) {
                sails.log.error(err);
                return reject();
              }

              ClientService.update({id: _clients[0].id, customerId: customer.id})
              .then(() => {
                mocksContainer.push(customer);
                return next();
              })
              .catch(next);
            });
          });
        })
        .catch(reject);
      }, err => {
        if(err) return reject(err);
        return resolve(mocksContainer);
      });
    });
  },

  chargeCustomer() {
    return new Promise((resolve, reject) => {

      this.createClient()
        .then(_clients => {
          stripe.tokens.create({
            card: {
              "number": '4242 4242 4242 4242',
              "exp_month": 12,
              "exp_year": 2020,
              "cvc": '123'
            }
          }, (err, token) => {
            if(err) return reject();
            stripe.customers.create({
              description: faker.name.firstName() + ' ' + faker.name.lastName(),
              email: _clients[0].user,
              source: token.id
            }, (err, customer) => {
              if(err) {
                sails.log.error(err);
                return reject();
              }

              ClientService.update({id: _clients[0].id, customerId: customer.id})
              .then(() => {

                stripe.charges.create({
                  customer: customer.id,
                  amount: 2000,
                  currency: 'USD'
                }, (err, charge) => {
                  if(err) {
                    sails.log.error(err);
                    return reject();
                  }

                  return resolve(charge);
                });
              })
              .catch(reject);
            });
          });
        })
        .catch(reject);
    });
  },

  createUserHash() {
    return new Promise((resolve, reject) => {
      this.createClient()
        .then(_clients => {
          const hash = crypto.randomBytes(30).toString('hex');

          // Delete key if exit
          client.del('activate_' + _clients[0].user, err => {
            if(err) {
              sails.log.error(err);
              return reject();
            }
            // Create new one and set expire time on 7 days
            client.set('activate_' + _clients[0].user, hash, 'EX', 60 * 60 * 24 * 7, err => {
              if(err) {
                sails.log.error(err);
                return reject();
              }

              return resolve({email: _clients[0].user, hash: hash});
            });
          });
        })
        .catch(reject);
    });
  },

  createProductStripe(createTimes) {
    return new Promise((resolve, reject) => {

      let mocksContainer = [];

      async.times(createTimes || 1, (n, next) => {
        stripe.products.create({
          name: faker.commerce.productName(),
          description: faker.lorem.sentence(),
          attributes: ['name', 'amount'],
          metadata: {
            icon: 'yoga_icon',
            color: '#FFEEDD'
          }
        }, (err, product) => {
          if(err) {
            sails.log.error(err);
            return next(err);
          }

          mocksContainer.push(product);
          return next();
        });
      }, err => {
        if(err) return reject(err);
        return resolve(mocksContainer);
      });
    });
  },

  createTraining(createTimes) {
    return new Promise((resolve, reject) => {

      let mocksContainer = [];

      this.createTrainer()
        .then(_trainers => {
          this.createClient()
            .then(_clinets => {
              this.createBuilding()
                .then(_buildings => {
                  TrainingType.findOrCreate({name: 'Yoga'}, {name: 'Yoga'})
                  .then(() => {
                    async.times(createTimes || 1, (n, next) => {
                      Training.create({
                        name: faker.commerce.productName(),
                        date: new Date().getTime(),
                        trainerId: _trainers[0].id,
                        clients: [_clinets[0].id],
                        duration: faker.random.number(),
                        type: 'Yoga',
                        cost: 15,
                        buildingId: _buildings[0].id,
                        trainerCost: 300
                      })
                          .meta({fetch: true})
                          .then(_trainig => {
                            mocksContainer.push(_trainig);
                            next();
                          })
                          .catch(err => {
                            sails.log.error(err);
                            return reject();
                          });
                    }, err => {
                      if(err) return reject(err);
                      return resolve(mocksContainer);
                    });
                  })
                .catch(err => {
                  sails.log.error(err);
                  return reject();
                });
                })
                .catch(reject);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },

  createTrainingType(createTimes) {
    return new Promise((resolve, reject) => {

      let mocksContainer = [];

      async.times(createTimes || 1, (n, next) => {
        TrainingType.create({
          name: faker.commerce.productName()
        })
          .meta({fetch: true})
          .then(_trainigType => {
            mocksContainer.push(_trainigType);
            next();
          })
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
      }, err => {
        if(err) return reject(err);
        return resolve(mocksContainer);
      });
    });
  },

  createSchedule(createTimes, clientId) {
    return new Promise((resolve, reject) => {

      let mocksContainer = [];

      this.createTraining()
        .then(_trainings => {
          this.createClient()
            .then(_clinets => {
              async.times(createTimes || 1, (n, next) => {
                Schedule.create({
                  clientId: clientId || _clinets[0].id,
                  date: new Date().getTime(),
                  trainingId: _trainings[0].id
                })
                .meta({fetch: true})
                .then(_schedule => {
                  mocksContainer.push(_schedule);
                  next();
                })
                .catch(err => {
                  sails.log.error(err);
                  return reject();
                });
              }, err => {
                if(err) return reject(err);
                return resolve(mocksContainer);
              });
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },

  createProspectTask(createTimes) {
    return new Promise((resolve, reject) => {
      let mocksContainer = [];

      async.times(createTimes || 1, function(n, next) {
        Prospect.create({
          name: faker.lorem.sentence(),
          description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit'
        })
         .meta({fetch: true})
         .then(data => {
           mocksContainer.push(data);
           next();
         })
         .catch(next);
      }, err => {
        if(err) return reject(Error("Can't create mocks"));

        return resolve(mocksContainer);
      });
    });
  },

  createTask(createTimes) {
    return new Promise((resolve, reject) => {
      this.createTrainer()
      .then(_trainers => {

        this.createManager()
          .then(_managers => {
            let mocksContainer = [];

            async.times(createTimes || 1, function(n, next) {
              Task.create({
                name: faker.lorem.sentence(),
                description: faker.lorem.sentence(),
                managerId: _managers[0].id,
                user: _trainers[0].user
              })
              .meta({fetch: true})
              .then(data => {
                mocksContainer.push(data);
                next();
              })
              .catch(reject);
            }, err => {
              if(err) throw Error("Can't create mocks");

              return resolve(mocksContainer);
            });
          })
          .catch(reject);
      })
      .catch(reject);
    });
  },

  createProduct(createTimes, clientId) {
    return new Promise((resolve, reject) => {
      this.createClient()
      .then(_clients => {

        let mocksContainer = [];

        async.times(createTimes || 1, function(n, next) {
          Product.create({
            name: faker.commerce.productName(),
            clientId: clientId || _clients[0].id,
            quantity: faker.random.number()
          })
            .meta({fetch: true})
            .then(_product => {
              mocksContainer.push(_product);
              next();
            })
            .catch(reject);
        }, err => {
          if(err) throw Error("Can't create mocks");

          return resolve(mocksContainer);
        });
      })
      .catch(reject);
    });
  },

  createInvoice(createTimes, email) {
    return new Promise((resolve, reject) => {
      this.createClient()
      .then(_clients => {

        let mocksContainer = [];

        async.times(createTimes || 1, function(n, next) {
          InvoiceService.create({
            email: email || _clients[0].user,
            name: faker.name.findName(),
            products: [
              {name: faker.commerce.productName(), price: faker.random.number()},
              {name: faker.commerce.productName(), price: faker.random.number()},
              {name: faker.commerce.productName(), price: faker.random.number()},
              {name: faker.commerce.productName(), price: faker.random.number()},
              {name: faker.commerce.productName(), price: faker.random.number()}
            ]
          })
          .meta({fetch: true})
            .then(data => {
              mocksContainer.push(data);
              next();
            })
            .catch(next);
        }, err => {
          if(err) throw Error("Can't create mocks");

          return resolve(mocksContainer);
        });
      })
      .catch(reject);
    });
  },

  createSignedClientToTrainingWithSession() {
    return new Promise((resolve, reject) => {
      this.createTraining()
        .then(_trainings => {

          this.createClientSession(true)
          .then(_sid => {
            supertest(sails.hooks.http.app)
             .put('/training/' + _trainings[0].id)
             .set('token', _sid.session.token)
             .send()
             .end(err => {
               if(err) throw err;

               _sid.training = _trainings[0];
               return resolve(_sid);
             });
          })
          .catch(reject);
        })
        .catch(reject);
    });
  },

  createTemplateTask(createTimes) {
    return new Promise((resolve, reject) => {
      const mocksContainer = [];

      async.times(createTimes || 1, function(n, next) {
        Task.create({
          name: faker.lorem.sentence(),
          description: faker.lorem.sentence(),
          template: true
        })
        .meta({fetch: true})
        .then(data => {
          mocksContainer.push(data);
          next();
        })
        .catch(next);
      }, err => {
        if(err) return reject(err);

        return resolve(mocksContainer);
      });
    });
  },

  createMeasurements(createTimes, clientId) {
    return new Promise((resolve, reject) => {
      const mocksContainer = [];

      this.createClient()
      .then(_clients => {
        const clientID = clientId || _clients[0].id;
        async.times(createTimes || 1, (n, next) => {
          Measurements.create({
            clientId: clientID,
            weight: faker.random.number(),
            height: faker.random.number(),
            bfp: faker.random.number(),
            waist: faker.random.number(),
            hips: faker.random.number(),
            cb: faker.random.number(),
            thighs: faker.random.number(),
            arms: faker.random.number()
          })
            .meta({fetch: true})
            .then(data => {
              mocksContainer.push(data);
              next();
            })
            .catch(next);
        }, err => {
          if(err) return reject(err);
          if(clientId) {
            Client.findOne({id: clientID})
              .populateAll()
              .then(_client => {
                return resolve({
                  user: _client.user,
                  data: mocksContainer
                });
              })
              .catch(reject);
          } else {
            return resolve(mocksContainer);
          }
        });
      })
    .catch(reject);
    });
  },

  createShopItem(createTimes) {
    return new Promise((resolve, reject) => {
      const mocksContainer = [];

      async.times(createTimes || 1, (n, next) => {
        ShopItem.create({
          name: faker.commerce.productName(),
          icon: faker.random.word(),
          color: faker.random.word(),
          description: faker.random.word(),
          category: faker.commerce.productMaterial(),
          personal: faker.random.boolean(),
          imageInCategory: faker.random.image(),
          image: faker.random.image()
        })
        .meta({fetch: true})
        .then(data => {
          TrainingType.create({
            name: data.name,
            icon: data.icon,
            color: data.color,
            personal: data.personal
          })
          .then(() => {
            mocksContainer.push(data);
            next();
          })
          .catch(next);
        })
        .catch(next);
      }, err => {
        if(err) return reject(err);

        return resolve(mocksContainer);
      });
    });
  },

  createSku(createTimes) {
    return new Promise((resolve, reject) => {

      let mocksContainer = [];

      this.createShopItem(createTimes)
          .then(_products => {
            async.times(createTimes || 1, (n, next) => {
              Sku.create({
                name: faker.commerce.productName(),
                productId: _products[n].id,
                cost: 3000,
                duration: 60,
                quantity: 12
              })
                .meta({fetch: true})
                .then(_sku => {
                  mocksContainer.push(_sku);
                  next();
                })
                .catch(next);
            }, err => {
              if(err) return reject(err);
              return resolve(mocksContainer);
            });
          })
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
    });
  },

  createOrder(createTimes) {
    return new Promise((resolve, reject) => {
      const mocksContainer = [];
      this.createClient()
        .then(_clients => {
          async.times(createTimes || 1, (n, next) => {
            this.createShopItem()
            .then(_items => {
              OrderService.create({
                productId: _items[0].id,
                quantity: faker.random.number(),
                discount: faker.random.word(),
                clientId: _clients[0].id
              })
              .then(_order => {
                mocksContainer.push(_order);
                next();
              })
              .catch(next);
            })
            .catch(next);
          }, err => {
            if(err) return reject(err);

            return resolve(mocksContainer);
          });
        })
        .catch(reject);
    });
  }
};
