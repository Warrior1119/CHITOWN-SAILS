'use strict';
/** @module Training*/

/** @function
  @name create - Create training
  @memberof module:Training
  @desc Route - {@linkcode POST:/training}
  @param {String} name
  @param {String} [description]
  @param {Timestamp} date
  @param {Number} trainerId - If request owner is trainer then trainerId wil be taken from his token
  @param {Array} clients - should be array even if is only one client. It should be onlu client id eg. [9, 10, 11]. From trainer max 3 clients.
  @param {Number} mainClient - Only for personal training
  @param {Number} duration - In minutes
  @param {String} type - Name type of training
  @param {Number} cost - In $$$. if training is Free, send 0. Cost will be set only for trainigs created like EVENT.
  @param {Number} [capacity] - If param doesn't exist then capacity will be set to 1 (personal 'one to one' training)
  @param {Number} buildingId - Required only if trainig is group
  @param {Boolean} [event] - Set if trainig is `event`
  @param {String} [schedulerType] - Available options: daily, weekly, monthly
  @param {Number} [endDate] - Timestamp. Required if we want set few trainings in feature
  @param {Array} [week] - Numbers of days in week
  @param {String} [file] - Should be in base64 encoded. Max 16 MB (16777216 B)
  @param {file} image - Max 2 MB
  @param {String} [place] - Should be in path or uri

  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} trainingType doesn't exist or building not found or building is deactivated
  @returns [Forbidden]{@link Forbidden} if clients array.length > 3 or if building is deactivated
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;

  if(!data.file || data.file === "" || data.file === "undefined") delete data.file;
  if(data.file && data.file.length >= 16777216) return res.error({ errCode: 400, message: 'File size must be less than 16MB' });

  if(Utilities.isJSON(data.clients)) data.clients = JSON.parse(data.clients);
  if(Utilities.isJSON(data.week)) data.week = JSON.parse(data.week);

  if(req.permission === 2) {
    Utilities.getTrainerId(req.token.userID)
      .then(_trainerId => {
        data.trainerId = _trainerId;

        return Utilities.prepareData(data, req.permission, 'Training');
      })
      .then(data => {
        if(data.clients && data.clients.length > 3 || data.capacity > 3) return res.error({ errCode: 403, message: 'Max capacity and clients should be 3' });
        if(data.mainClient === undefined) return res.error({ errCode: 400, message: 'Required main client' });

        ValidService.valid(data, 'Training')
          .then(() =>  {
            TrainingService.createPersonal(data, req)
              .then(res.created)
              .catch(res.error);
          })
          .catch(res.error);
      })
      .catch(res.error);
  } else {
    Utilities.prepareData(data, req.permission, 'Training')
      .then(data => {
        ValidService.valid(data, 'Training')
          .then(() =>  {
            if(!data.clients && !data.mainClient && data.buildingId ){
              TrainingService.createGroup(data, req)
                .then(res.created)
                .catch(res.error);
            } else if(data.clients && data.clients.length >= 1 && data.mainClient) {
              TrainingService.createPersonal(data, req)
                .then(res.created)
                .catch(res.error);
            } else {
              return res.error(400);
            }
          })
          .catch(res.error);
      })
      .catch(res.error);
  }
};
