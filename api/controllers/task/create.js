'use strict';
/** @module Task*/

/** @function
  @name create - Create task
  @memberof module:Task
  @desc Route - {@linkcode POST:/task}
  @param {String} name
  @param {String} description
  @param {String} category - max 254 chars :)
  @param {Number} priority - max 254 chars :)
  @param {Number} date - Timestamp
  @param {String} user
  @param {Boolean} template - Require only if we want to create task template for prospect users
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} user/manager not found
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;

  if(data.template === true) {
    Utilities.prepareData(data, req.permission, 'TaskTemplate')
      .then(data => {
        ValidService.valid(data, 'TaskTemplate')
          .then(() => {
            return TaskService.createTemplate(data);
          })
          .then(res.created)
          .catch(res.error);
      })
      .catch(res.error);
  } else {
    data.userID = req.token.userID;

    Utilities.prepareData(data, req.permission, 'Task')
      .then(data => {
        ValidService.valid(data, 'Task')
          .then(() => {
            return TaskService.create(data);
          })
          .then(res.created)
          .catch(res.error);
      })
      .catch(res.error);
  }
};
