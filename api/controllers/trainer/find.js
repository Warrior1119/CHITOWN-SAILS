'use strict';
/** @function
  @name find - Find all trainers
  @memberof module:Trainer
  @desc Route - {@linkcode GET:/trainer/all}
  @returns Find - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  TrainerService.find()
    .then(res.ok)
    .catch(res.error);
};
