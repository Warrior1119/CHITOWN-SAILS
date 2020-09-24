'use strict';
/** @function
  @name update - Update task
  @memberof module:Task
  @desc Route - {@linkcode PUT:/task/:id}
  @param {String} id
  @param {String} data
  @returns Ok - status 200 with task object
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  const id = req.param('id');

  if(Utilities.maxLength(data.description, 254)) return res.error(400);

  Utilities.prepareData(data, req.permission, 'Task')
    .then(data => {
      ValidService.valid({ id }, 'Task', true)
        .then(() => {
          TaskService.update(id, data)
            .then(res.ok)
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
