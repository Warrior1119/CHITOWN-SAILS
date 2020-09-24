'use strict';

/** @function
  @name findOne - Find one task
  @memberof module:Task
  @desc Route - {@linkcode GET:/task/:id}
  @param {Number} id
  @returns OK - status 200 with object
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function findOne (req, res) {
  const id = req.param('id');

  ValidService.valid({ id }, 'Task', true)
    .then(() => {
      TaskService.findOne(id)
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);

};
