'use strict';
/** @function
  @name find - Find all trainers
  @memberof module:Manager
  @desc Route - {@linkcode GET:/manager/:start/:end}
  @param {Number} start - start of range
  @param {Number} end - end of range
  @returns Find - status 200 with content. They will be sorted from newest
  @returns [Server error]{@link Server_error}
*/
module.exports = function find (req, res) {
  const data = {
    start: req.param('start'),
    end: req.param('end')
  };

  if(isNaN(data.start) || isNaN(data.start)) return res.error(400);

  ManagerService.find(data)
    .then(res.ok)
    .catch(res.error);
};
