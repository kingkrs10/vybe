const currencyModel = require("./model");
const userModel = require("../users/model");
const commonModel = require("../common/common");
const {sendErrorResponse, sendInternalErrorResponse, sendSuccessResponse, sendNoContentResponse } = require("../common/ResponseController");
const _isEmpty = require('lodash/isEmpty');

const getCurrency = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(Currency:getCurrency)",
         currencyModel.getCurrency
      );
      if (result.error){
         sendErrorResponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         sendSuccessResponse(response, result.data);
      } else {
         sendNoContentResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

module.exports = {
   getCurrency,
};
