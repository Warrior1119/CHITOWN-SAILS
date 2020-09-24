'use strict';
/** @function
  @name findOne - find one trainer or get info to his dashboard
  @memberof module:Trainer
  @desc Route - {@linkcode GET:/trainer/:id}
  @param {Number} [id] - If id doesn't exist then userID will be taken from token
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findone (req, res) {
  let data = req.param("id");

  if(data === undefined || data === null) {
    data = req.token.userID;

    ValidService.valid({ id: data }, 'Trainer', true)
      .then(() => {
        TrainerService.getDashboard(data)
          .then(res.ok)
          .catch(res.error);
      })
      .catch(res.error);
  } else {
    ValidService.valid({ id: data }, 'Trainer', true)
      .then(() => {
        TrainerService.findOne(data)
          .then(res.ok)
          .catch(res.error);
      })
      .catch(res.error);
  }
};
