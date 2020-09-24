'use strict';

function getRandomManager () {
  return new Promise((resolve, reject) => {
    Manager.find()
      .then(_managers => resolve(_managers[Math.floor(Math.random()*_managers.length)]))
      .catch(err => {
        sails.log.error(err);
        return reject();
      });

  });
}

function getManagersEmails () {
  return new Promise((resolve, reject) => {
    Manager.find()
      .then(_managers => {
        const emails = _managers.map(x => x.user);
        return resolve(emails);
      })
      .catch(err => {
        sails.log.error(err);
        return reject(err);
      });

  });
}

function postChargeOperation (sku, client, recipient, message, path, req) {
  return new Promise((resolve, reject) => {
    switch (sku.productId.category) {
      case 'Product':
        getManagersEmails()
          .then(_managersEmail => {
            return Promise.all([
              EmailService.toolConfirm(client, sku),
              EmailService.toolBought(_managersEmail, client, sku)
            ]);
          })
          .then(resolve)
          .catch(reject);
        resolve();
        break;
      case 'Nutrition Services':
        Diet.findOrCreate({ name: sku.name },{ clientId: client.id, name: sku.name })
          .then(_diet => {
            if(!_diet) return reject(404);

            if(!!client.trainerId) {
              TaskService.dietBought(client)
                .then(resolve)
                .catch(reject);
            } else {
              getRandomManager()
                .then(_manager => {
                  EmailService.dietBought(_manager, client, sku)
                    .then(resolve)
                    .catch(reject);
                })
                .catch(reject);
            }
          })
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
        break;
      case 'Gift':
        GiftCardService.create({ skuId: sku.id })
          .then(_gift => {
            getManagersEmails()
              .then(_emails => {
                return Promise.all([
                  EmailService.sendGift(_gift, client, recipient, message),
                  EmailService.confirmGift(_gift, client, recipient, message),
                  EmailService.notyfiGiftManager(_gift, client, recipient, message, _emails)
                ]);
              })
              .then(resolve)
              .catch(reject);
          })
          .catch(reject);
        break;
      default:
        if(sku.productId.personal) {
          ProductService.createOrUpdate({ // Add product to client stash
            invoicePath: path,
            clientId: client.id,
            productId: sku.productId.id,
            name: `${sku.productId.name}`,
            quantity: sku.quantity,
            duration: sku.duration,
            icon: sku.productId.icon,
            color: sku.productId.color,
            personal: sku.productId.personal,
            price: sku.cost,
          }, req)
            .then(() => {
              return EmailService.sendReceipt({ email: client.user.email, client: client, productName: `${sku.productId.name} ${sku.duration} (x${sku.quantity})` });
            })
            .then(resolve)
            .catch(reject);
        } else {
          return reject(400);
        }
    }
  });
}

function updateTrainingTypesAndTrainings (data, productName) {
  return new Promise((resolve, reject) => {
    if(!data.name) return resolve();
    TrainingType.find({ name: { 'like': `${productName}%` } })
      .then(_types => {

        async.each(_types, (type, next) => {
          if(!new RegExp("^"+productName+"\\s[0-9]+").test(type.name)) return next();

          TrainingType.update({ id: type.id })
            .set({ name: `${data.name} ${type.duration} min`, active: data.activeType || type.active })
            .then(() => Training.update({ type: type.name }).set({ type: `${data.name} ${type.duration} min` }))
            .then(next)
            .catch(next);
        }, err => {
          if(err) return reject(err);

          return resolve();
        });
      })
      .catch(reject);

  });
}

function applyPromo (cost, code) {
  if(code.discountType === 'value' && code.quantity)
    cost = cost - code.discountAmount;
  else
    cost = cost - (cost * (code.discountAmount / 100));

  return cost;
}

function confirmDiscount (data, costOfProduct, productId) {
  return new Promise((resolve, reject) => {
    const errors = [];
    let code;
    Promise.resolve()
      .then(() => {
        if(!data.promoCode) return Promise.resolve();

        return PromoCode.findOne({ hash: data.promoCode, expDate: { '>': new Date().getTime() }, quantity: { '>': 0 }, active: true }).populateAll();
      })
      .then(_code => {
        if(!_code && data.promoCode) errors.push({ type: 'Promo code', message: 'Promotion code invalid' });
        else code = _code;

        if(!data.giftCard) return Promise.resolve();

        return GiftCard.findOne({ hash: data.giftCard, expDate: { '>': new Date().getTime() } });
      })
      .then(_gift => {
        if(!_gift && data.giftCard) errors.push({ type: 'Gift card', message: 'Gift card invalid' });

        if(code && code.all === true) {
          costOfProduct = applyPromo(costOfProduct, code);
        } else if(code && code.all === false) {
          if(_.findIndex(code.products, item => item.id === productId) !== -1)
            costOfProduct = applyPromo(costOfProduct, code);
        }

        if(_gift) costOfProduct = costOfProduct - _gift.value;

        return resolve({
          price: costOfProduct < 0 ? 0 : costOfProduct,
          errors: errors
        });
      })
      .catch(reject);
  });
}

function applyDiscount (data, costOfProduct, productId) {
  return new Promise((resolve, reject) => {
    Promise.resolve()
      .then(() => {
        if(!data.promoCode) return Promise.resolve();

        return PromoCode.findOne({ hash: data.promoCode, expDate: { '>': new Date().getTime() }, quantity: { '>': 0 }, active: true }).populateAll();
      })
      .then(_code => {
        if(!_code && data.promoCode) throw { errCode: 403, message: 'Promotion code invalid' };

        if(_code && _code.all === true) {
          costOfProduct = applyPromo(costOfProduct, _code);
        }
        else if(_code && _code.all === false) {
          if(_.findIndex(_code.products, item => item.id === productId) !== -1)
            costOfProduct = applyPromo(costOfProduct, _code);
        }

        if(!data.giftCard) return Promise.resolve();

        return GiftCard.findOne({ hash: data.giftCard, expDate: { '>': new Date().getTime() } });
      })
      .then(_gift => {
        if(!_gift && data.giftCard) throw { errCode: 403, message: 'Gift card invalid' };

        if(_gift) costOfProduct = costOfProduct - _gift.value;

        return resolve(costOfProduct);
      })
      .catch(reject);
  });
}

module.exports = {
  create (data, req) {
    return new Promise((resolve, reject) => {
      ShopItem.findOne({ name: data.name })
        .then(_item => {
          if(_item) throw { errCode: 409, message: 'Product with that name already exist' };
          const images = [
            { file: req.file('image'), dir: './opt/default/' },
            { file: req.file('imageInCategory'), dir: './opt/default/' }
          ];

          return UploadService.uploadMany(images);
        })
        .then(_files => {
          if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
          if(_files[1]) data[_files[1].field] = _files[1].fd.replace(/^.*[\\\/]/, '');

          return ShopItem.create(data).meta({ fetch: true });
        })
        .then(resolve)
        .catch(reject);
    });
  },

  find () {
    return new Promise((resolve, reject) => {
      ShopItem.find()
        .then(_items => {
          async.each(_items, (item, next) => {
            Sku.find({ productId: item.id })
              .then(_sku => {
                item.sku = _sku;
                next();
              })
              .catch(next);
          }, err => {
            if(err) {
              sails.log.error(err);
              return reject();
            }

            return resolve(_items);
          });
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findForClient (userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: `User not found` };

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: `Client not found` };

          ShopItem.find({ active: true, category: { '!': [ 'Group Training' ] } })
            .then(_items => {
              async.each(_items, (item, next) => {
                ServiceTrainer.find({ serviceId: { startsWith: item.name } })
                  .then(service => Trainer.find({ id: service.map(x => x.trainerId) }).populate('user'))
                  .then(trainers => {
                    item.trainers = trainers;
                    return Sku.find({ productId: item.id });
                  })
                  .then(_sku => {
                    if(item.category === 'Nutrition Services') {
                      item.sku = [];
                      async.eachSeries(_sku, (itemSku, nextSku) => {
                        Diet.findOne({ name: itemSku.name, clientId: _client.id })
                          .then(_diet => {
                            if(!_diet) item.sku.push(itemSku);

                            nextSku();
                          })
                          .catch(nextSku);
                      }, err => {
                        if(err) return next(err);

                        next();
                      });
                    } else {
                      item.sku = _sku;
                      next();
                    }
                  })
                  .catch(next);
              }, err => {
                if(err) return reject(err);

                return resolve(_items);
              });
            })
            .catch(reject);
        })
        .catch(reject);
    });
  },

  update (data, req) {
    return new Promise((resolve, reject) => {
      ShopItem.findOne({ id: data.id })
        .then(_item => {
          if(!_item) return reject(404);

          return updateTrainingTypesAndTrainings(data, _item.name);
        })
        .then(() => {

          const images = [
            { file: req.file('image'), dir: './opt/default/' },
            { file: req.file('imageInCategory'), dir: './opt/default/' }
          ];

          return UploadService.uploadMany(images);
        })
        .then(_files => {
          if(_files[0]) data[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
          if(_files[1]) data[_files[1].field] = _files[1].fd.replace(/^.*[\\\/]/, '');

          return ShopItem.update({ id: data.id }).set(data).meta({ fetch: true });
        })
        .then(_item => resolve(_item[0]))
        .catch(reject);
    });
  },

  destroy (id) {
    return new Promise((resolve, reject) => {
      ShopItem.findOne({ id: id })
        .then(_item => {
          if(!_item) return reject(404);

          return ShopItem.destroy({ id: id });
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findDietsForClient (userId) {
    return new Promise((resolve, reject) => {
      User.findOne({ id: userId })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: `User not found` };

          return Client.findOne({ user: _user.email });
        })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: `Client not found` };

          ShopItem.find({ active: true, category: 'Nutrition Services' })
            .then(_items => {
              async.eachSeries(_items, (item, next) => {
                Sku.find({ productId: item.id })
                  .then(_sku => {
                    item.sku = [];
                    async.eachSeries(_sku, (itemSku, nextSku) => {
                      Diet.findOne({ name: itemSku.name, clientId: _client.id })
                        .then(_diet => {
                          if(!_diet) item.sku.push(itemSku);
                          else item.sku.push(_diet);

                          nextSku();
                        })
                        .catch(nextSku);
                    }, err => {
                      if(err) return next(err);

                      next();
                    });
                  })
                  .catch(next);
              }, err => {
                if(err) {
                  sails.log.error(err);
                  return reject(err);
                }

                return resolve(_items);
              });
            })
            .catch(err => {
              sails.log.error(err);
              return reject(err);
            });
        })
        .catch(err => {
          sails.log.error(err);
          return reject(err);
        });
    });
  },

  findDiets () {
    return new Promise((resolve, reject) => {
      ShopItem.find({ category: 'Nutrition Services' })
        .then(_items => {
          async.each(_items, (item, next) => {
            Sku.find({ productId: item.id })
              .then(_sku => {
                item.sku = _sku;
                next();
              })
              .catch(next);
          }, err => {
            if(err) {
              sails.log.error(err);
              return reject();
            }

            return resolve(_items);
          });
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  buy (data, req) {
    return new Promise((resolve, reject) => {
      let sku;
      let charge;

      Sku.findOne({ id: data.skuId, active: true })
        .populateAll()
        .then(_sku => {
          if(!_sku) throw { errCode: 404, message: 'Sku not found' };
          if(!_sku.productId.active) throw { errCode: 400, message: 'Product is not active' };
          if(_sku.productId.category === 'Gift' && !data.recipient) throw { errCode: 400, message: 'Recipient missed' };
          sku = _sku;

          return User.findOne({ id: data.userID });
        })
        .then(_user => {
          if(!_user) throw { errCode: 404, message: 'User not found' };

          return Client.findOne({ user: _user.email }).populateAll();
        })
        .then(_client => {
          if(!_client) throw { errCode: 404, message: 'Client not found' };
          let cost;
          applyDiscount(data, sku.cost, sku.productId.id)
            .then(_cost => {
              if(_cost === undefined || _cost === null) throw { errCode: 404, message: 'Cant calculate cost' };
              cost = _cost;

              const chargeObj = { amount: _cost < 0 ? 0 : _cost, description: sku.name };

              return ChargeService.charge(chargeObj, _client, data.cardToken);
            })
            .then((_charge) => {
              charge = _charge || {};
              return OrderService.create({ skuId: sku.id, clientId: _client.id, totalCost: cost, chargeId: charge.id || null });
            })
            .then((_path) => {
              return postChargeOperation(sku, _client, data.recipient, data.message, _path, req);
            })

            .then(() => {
              return Administrator.find().limit(1);
            })
            .then(_admin => {
              return EmailService.sendReceiptAdmin({ admin: _admin[0], client: _client, productName: sku.productId.name });
            })
            .then(() => {
              if(!data.promoCode) return Promise.resolve();

              return PromoCode.findOne({ hash: data.promoCode });
            })
            .then(_code => {
              if(!_code) return Promise.resolve();

              return PromoCode.update({ hash: data.promoCode }).set({ quantity: _code.quantity - 1 });
            })
            .then(() => {
              if(!data.giftCard) return Promise.resolve();

              return GiftCard.destroy({ hash: data.giftCard });
            })
            .then(() => {
              delete charge.source;
              delete charge.refunds;
              return resolve(charge);
            })
            .catch(reject);
        })
        .catch(err => {
          sails.log.error(err);
          return reject(err);
        });
    });
  },

  confirm (data) {
    return new Promise((resolve, reject) => {
      Sku.findOne({ id: data.skuId, active: true })
        .populateAll()
        .then(_sku => {
          if(!_sku) throw { errCode: 404, message: 'Sku not exist' };
          if(!_sku.productId.active) throw { errCode: 404, message: 'Product not active' };

          if(!data.promoCode || data.promoCode === '0') delete data.promoCode;
          if(!data.giftCard || data.giftCard === '0') delete data.giftCard;

          return confirmDiscount(data, _sku.cost, _sku.productId.id);
        })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject(err);
        });
    });
  }
};
