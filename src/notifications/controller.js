const _isEmpty = require('lodash/isEmpty');
const notificationsModel = require("./model");
const commonModel = require("../common/common");
const {sendErroresponse, sendSuccessResponse, sendInternalErrorResponse, sendNoContentResponse} = require("../common/ResponseController");

const create = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Notifications:create)",
         notificationsModel.create
      );
      if (!result.error){
         sendErroresponse(response, result.message);
      } else if (!result.error){
         sendSuccessResponse(response, result['data']);
		} else {
			sendInternalErrorResponse(response);
		}
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
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
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result['data']);
		} else {
			sendNoContentResponse(response);
		}
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

module.exports = {
   create,
   getUsersNotification,
};
