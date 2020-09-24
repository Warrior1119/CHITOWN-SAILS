'use strict';

module.exports = {
  create (data, req) {
    return new Promise((resolve, reject) => {
      let _client;
      const book_data = {
        name: data.name,
        price: data.price,
        questions: JSON.stringify(data.questions),
      };
      const img_array = {images: []};
      const images = [
        { file: req.file('images[0]'), dir: './opt/book_images/' },
        { file: req.file('images[1]'), dir: './opt/book_images/' },
        { file: req.file('images[2]'), dir: './opt/book_images/' }
      ];

      UploadService.uploadMany(images)
        .then(_files => {
          if(_files[0]) {
            img_array[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
            img_array.images.push(img_array[_files[0].field])
          }
          if(_files[1]) {
            img_array[_files[1].field] = _files[1].fd.replace(/^.*[\\\/]/, '');
            img_array.images.push(img_array[_files[1].field])
          }
          if(_files[2]) {
            img_array[_files[2].field] = _files[2].fd.replace(/^.*[\\\/]/, '');
            img_array.images.push(img_array[_files[2].field])
          }

          book_data.images = JSON.stringify(img_array.images);
          Book.create(book_data)
          .meta({ fetch: true })
          .then(resolve)
          .then(() => {
            return User.findOne({ id: req.token.userID });
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
              apartment_number: `${_client.apartment}`,
              buildingName: `${_client.buildingId.name}`,
              price: `${data.price}`,
              questions: `${book_data.questions}`,
              serviceName: `${data.name}`,
              date: `${new Date(parseInt(data.date))}`,
              message: `${data.message}`
            });
          })
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
        })
        .catch(reject)
    });
  },

  find () {
    return new Promise((resolve, reject) => {
      Book.find({})
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  findOne (id) {
    return new Promise((resolve, reject) => {
      Book.findOne({ id: id })
        .then(book => {
          if(!book) return reject(404);

          return resolve(book);
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
    });
  },

  destroy (id) {
    return new Promise((resolve, reject) => {
      Book.findOne({ id: id})
      .then((_book) => {
        if (!_book) throw { errCode: 404, message: 'Book not found' };
        Book.destroy({ id: id })
        .then(resolve)
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });
    });
  },

  update (id, data) {
    return new Promise((resolve, reject) => {
      const book_data = {
        name: data.name,
        price: data.price,
        questions: JSON.stringify(data.questions)
      };

      const img_array = {images: []};

      const images = [
        { file: req.file('images[0]'), dir: './opt/book_images/' },
        { file: req.file('images[1]'), dir: './opt/book_images/' },
        { file: req.file('images[2]'), dir: './opt/book_images/' }
      ];

      Book.findOne({id: id})
      .then((book) => {
        if(!book) return reject({ errCode: 404, message: 'Book Service not found' });

        UploadService.uploadMany(images)
        .then(_files => {
          if(_files[0]) {
            img_array[_files[0].field] = _files[0].fd.replace(/^.*[\\\/]/, '');
            img_array.images.push(img_array[_files[0].field])
          }
          if(_files[1]) {
            img_array[_files[1].field] = _files[1].fd.replace(/^.*[\\\/]/, '');
            img_array.images.push(img_array[_files[1].field])
          }
          if(_files[2]) {
            img_array[_files[2].field] = _files[2].fd.replace(/^.*[\\\/]/, '');
            img_array.images.push(img_array[_files[2].field])
          }

          book_data.images = JSON.stringify(img_array.images);

          Book.update({id: id})
          .set(book_data)
          .then(resolve)
          .catch(err => {
            sails.log.error(err);
            return reject();
          });
        })
        .catch(err => {
          sails.log.error(err);
          return reject();
        });
      })
      .catch(err => {
        sails.log.error(err);
        return reject();
      });

    });
  }

};
