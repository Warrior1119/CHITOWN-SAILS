'use strict';
/** @module Measurements*/

/** @function
  @name create - Create measurements
  @memberof module:Measurements
  @desc Route - {@linkcode POST:/measurements}
  @param {Number} [clientId] - Only when req not belong to client
  @param {Number} weight
  @param {Number} height
  @param {Number} bfp
  @param {Number} waist
  @param {Number} hips
  @param {Number} cb
  @param {Number} thighs
  @param {Number} arms
  @returns Created - status 201
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} Client or creator not found
  @returns [Forbidden]{@link Forbidden} Only if req belong to trainer. Client not assigned to trainer
  @returns [Server error]{@link Server_error}
*/
module.exports = function create (req, res) {
  const data = req.body;
  data.userID = req.token.userID;

  Utilities.prepareData(data, req.permission, 'Measurements')
    .then(data => {
      ValidService.valid(data, 'Measurements')
        .then(() => {
          if(req.permission === 4) return MeasurementsService.createByClient(data);
          else if(req.permission === 2) return MeasurementsService.createByTrainer(data);
          else return MeasurementsService.createByManager(data);
        })
        .then(res.created)
        .catch(res.error);
    })
    .catch(res.error);
};
