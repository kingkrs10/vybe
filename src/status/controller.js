const statusModel = require("./model");
const commonModel = require("../common/common");
const {sendErroresponse, sendNoContentResponse, sendSuccessResponse } = require("../common/ResponseController");
const _isEmpty = require('lodash/isEmpty');

const getAll = async (request, response, next) => {
   const reqObj = {
      ...request.currentUser
   }
   try {
      const result = await commonModel.tryBlock(
         reqObj,
         "(status:getAll)",
         statusModel.getAll
      );

      if (result.error) {
         sendErroresponse(response, result.message);
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