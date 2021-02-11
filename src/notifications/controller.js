const notificationsModel = require("./model");
const commonModel = require("../common/common");
const responseController = require("../common/ResponseController");

const create = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Notifications:create)",
         notificationsModel.create
      );
      if (!result.error){
         responseController.sendSuccessResponse(response, result['data'])
		} else {
			responseController.sendInternalErrorResponse(response)
		}
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getUsersNotification = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(Notifications:getUsersNotification)",
         notificationsModel.getUsersNotification
      );
      if (!result.error){
         responseController.sendSuccessResponse(response, result['data'])
		} else {
			responseController.sendInternalErrorResponse(response)
		}
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

module.exports = {
   create,
   getUsersNotification,
};
