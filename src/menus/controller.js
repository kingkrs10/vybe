const Model = require("./model");
const commonModel = require("../common/common");
const {
    sendErrorResponse, sendInternalErrorResponse, sendNoContentResponse, sendSuccessResponse
} = require("../common/ResponseController");
const _isEmpty = require('lodash/isEmpty');


const getAllMenus = async (request, response) => {
   try {
        const tempBody = {
            ...request.currentUser
        }
        const result = await commonModel.tryBlock(
            tempBody,
            "(Categories:getAllMenus)",
            Model.getAll
        );
      if (result.error) {
        sendErrorResponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
        sendSuccessResponse(response, result.data);
      } else {
        sendNoContentResponse(response);
      }
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

module.exports = {
   getAllMenus
}