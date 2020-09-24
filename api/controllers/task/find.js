'use strict';

/** @function
  @name find - Find tasks
  @memberof module:Task
  @desc Route - {@linkcode GET:/task/:start/:end/:user/:category/:priority}
  @param {Number} start
  @param {Number} end
  @param {Number} priority
  @param {String} [user] - Email. eg. `GET:/task/0/10/trainer1@trainer1.com`
  @param {String} [category] - eg. `GET:/task/0/10/trainer1@trainer1.com/Staff` , `GET:/task/0/10/trainer1@trainer1.com/Organization`.
   If u want to get form specify catergory without user, when set user on `0`
  @returns Ok - status 200 with array
  @returns [Bad request]{@link Bad_request}
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const data = {
    start: req.param('start'),
    end: req.param('end'),
    priority: req.param('priority'),
    user: req.param('user'),
    category: req.param('category')
  };

  ValidService.isNumber([ data.start, data.end ])
    .then(() => {
      if(req.permission === 2) {
        data.userID = req.token.userID;
        TaskService.findByTrainer(data)
          .then(res.ok)
          .catch(res.error);
      } else {
        TaskService.find(data)
          .then(res.ok)
          .catch(res.error);
      }
    })
    .catch(res.error);
};
