'use strict';
/** @function
  @name destroy - Destroy training
  @memberof module:Training
  @desc Route - {@linkcode DEL:/training/:id/:all}. Trainer can delete only future trainings
  @param {Number} id
  @param {Boolean} all - false or true
  @returns No content - status 204
  @returns [Bad request]{@link Bad_request}
  @returns [Forbidden]{@link Forbidden} Trainer can destroy only his trainings and trainings that start with, more than one day
  @returns [Server error]{@link Server_error}
*/
module.exports = function destroy (req, res) {
  const data = {
    id: req.param('id'),
    userID: req.token.userID,
    all: req.param('all')
  };

  if(data.all === undefined) data.all = 'false';

  if(![ 'true', 'false' ].includes(data.all))
    return res.error({ errCode: 400, message: 'Only avaible options are: true or false. You sent: ' + data.all });

  ValidService.valid({ id: data.id }, 'Training', true)
    .then(() => {
      if(req.permission === 3) return TrainingService.destroyByPropertyManager(data);
      else if(req.permission === 2) return TrainingService.destroyByTrainer(data);
      else if(req.permission <= 1) return TrainingService.destroy(data);
      else return res.error({ errCode: 403, message: 'Access denied' });
    })
    .then(res.noContent)
    .catch(res.error);
};
