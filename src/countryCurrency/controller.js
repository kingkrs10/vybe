const userCountryCurrencyModel = require("./model");
const userModel = require("../users/model");
const commonModel = require("../common/common");
const {sendErroresponse, sendInternalErrorResponse, sendSuccessResponse,sendNoContentResponse } = require("../common/ResponseController");
const _isEmpty = require('lodash/isEmpty');

const create = async (request, response, next) => {
   try {
      const tempbody ={
         balance: request.body.balance,
         currencyCode: request.body.currencyCode,
         currencySymbol: request.body.currencySymbol,
         uid: request.body.uid
      }
      const resUpdateBalance = await commonModel.tryBlock(
         tempbody,
         "(users:updateBalance)",
         userModel.updateBalance
      );
      if (resUpdateBalance.error){
            sendErroresponse(response, resUpdateBalance.message);
      } else if (!resUpdateBalance.error){
         const result = await commonModel.tryBlock(
            request.body,
            "(UserCountryCurrency:create)",
            userCountryCurrencyModel.bulkInsert
         );
         if (result.error){
            sendErroresponse(response, result.message);
         } else if (!result.error){
            sendSuccessResponse(response, result['data']);
         } else {
            sendInternalErrorResponse(response);
         }
      } else {
         sendInternalErrorResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const update = async (request, response, next) => {
   const data = {
      reqObj: request.body,
      uid: request.params.id,
   };
   try {
      const result = await commonModel.tryBlock(
         data,
         "(UserCountryCurrency:update)",
         userCountryCurrencyModel.update
      );

      if (result.error){
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

const getUserCountryCurrency = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(UserCountryCurrency:getUserCountryCurrency)",
         userCountryCurrencyModel.getUserCountryCurrency
      );
      if (result.error){
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         sendSuccessResponse(response, result.data);
      } else {
         sendNoContentResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const remove = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params,
         "(UserCountryCurrency:remove)",
         userCountryCurrencyModel.remove
      );
      if (result.error){
         sendErroresponse(response, result.message);
      } else if (!result.error) {
         sendSuccessResponse(response, result.data);
      } else {
         sendInternalErrorResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

module.exports = {
   create,
   update,
   remove,
   getUserCountryCurrency,
};
