'use strict';

/** @function
  @name update - Update measurements
  @memberof module:Measurements
  @desc Route - {@linkcode PUT:/measurements/:id}
  @param {Number} id
  @param {Object} data
  @returns OK - status 200
  @returns [Bad request]{@link Bad_request}
  @returns [Not found]{@link Not_found} Client or creator not found
  @returns [Forbidden]{@link Forbidden} Only if req belong to trainer. Client not assigned to trainer
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  data.id = req.param("id");
  data.userID = req.token.userID;

  Utilities.prepareData(data, req.permission, 'Measurements')
    .then(data => {
      ValidService.valid(data, 'Measurements', true)
        .then(() => {
          if(req.permission === 4) return MeasurementsService.updateByClient(data);
          else if(req.permission === 2) return MeasurementsService.updateByTrainer(data);
          else return MeasurementsService.update(data);
        })
        .then(res.ok)
        .catch(res.error);
    })
    .catch(res.error);
};
