'use strict';

module.exports = {
  download (data) {
    return new Promise((resolve, reject) => {
      switch (data.contentType) {
        case 'invoice':
          InvoiceService.findOne(data)
            .then(resolve)
            .catch(reject);
          break;
        case 'diet':
          DietService.findOne(data)
            .then(resolve)
            .catch(reject);
          break;
        default:

      }
    });
  }
};
