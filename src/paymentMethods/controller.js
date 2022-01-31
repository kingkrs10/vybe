const paymentMethodsModel = require("./model");
const commonModel = require("../common/common");
const {sendErrorResponse, sendNoContentResponse, sendSuccessResponse } = require("../common/ResponseController");
const _isEmpty = require('lodash/isEmpty');

const getAll = async (request, response, next) => {
   const reqObj = {
      ...request.currentUser
   }
   try {
      const result = await commonModel.tryBlock(
         reqObj,
         "(paymentMethods:getAll)",
         paymentMethodsModel.getAll
      );

      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         sendSuccessResponse(response, result.data);
      } else {
         sendNoContentResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() });
   }
};

module.exports = {
   getAll
}