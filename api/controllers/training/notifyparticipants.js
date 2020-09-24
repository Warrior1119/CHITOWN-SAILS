'use strict';
/** @function
  @name notifyParticipants
  @memberof module:Training
  @desc Route - {@linkcode POST:/training/notify/:id}
  @param {Number} id - Event ID
  @param {String} title - Max length: 100 chars
  @param {String} message - Max length: 3000 chars
  @returns Ok - status 200
  @returns [Server error]{@link Server_error}
  @returns [Not found]{@link Not_found} Event not found
  @returns [Forbidden]{@link Forbidden} It's only allowed to Admin, Manager and Property Manager
  @returns [Bad request]{@link Bad_request}
*/
module.exports = function (req, res) {
  const id = req.param('id');
  const data = {
    title: req.body.title,
    message: req.body.message
  };

  if(isNaN(id)) return res.error({ errCode: 404, message: 'ID is not a number' });
  if(!data.title || data.title.length > 100) return res.error({ errCode: 400, message: `Max length of title is 100 chars` });
  if(!data.message || data.message.length > 3000) return res.error({ errCode: 400, message: `Max length of message is 3000 chars` });

  TrainingService.notifyParticipants(id, data, req.token)
    .then(res.ok)
    .catch(res.error);
};
