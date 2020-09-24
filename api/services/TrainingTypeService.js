'use strict';

module.exports = {
  find () {
    return new Promise((resolve, reject) => {
      TrainingType.find({ active: true })
        .then(resolve)
        .catch(reject);
    });
  }
};
