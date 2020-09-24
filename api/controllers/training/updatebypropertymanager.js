'use strict';
/** @function
  @name updateByPropertyManager
  @memberof module:Training
  @desc Route - {@linkcode PUT:/propertyManager/training/:id}
  @param {Number} id
  @returns Ok - status 200 with trining data
  @returns [Bad request]{@link Bad_request}
  @returns [Forbidden]{@link Forbidden}
  @returns [Server error]{@link Server_error}
*/
module.exports = function update (req, res) {
  const data = req.body;
  data.id = req.param("id");
  data.userID = req.token.userID;

  Utilities.prepareData(data, req.permission, 'PropertyManagerTraining')
    .then(data => {
      ValidService.valid(data, 'PropertyManagerTraining', true)
        .then(() => {
          TrainingService.updateByPropertyManager(data)
            .then(res.ok)
            .catch(res.error);
        })
        .catch(res.error);
    })
    .catch(res.error);
};
