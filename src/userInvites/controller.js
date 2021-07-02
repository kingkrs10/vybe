const userInvitesModel = require("./model");
const commonModel = require("../common/common");
const {sendErroresponse, sendCreatedesponse, sendInternalErrorResponse, sendSuccessResponse } = require("../common/ResponseController");
const _isEmpty = require('lodash/isEmpty');

const create = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(UserInvites:create)",
         userInvitesModel.create
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!result.error){
         sendCreatedesponse(response, result['data']);
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
         "(UserInvites:update)",
         userInvitesModel.update
      );
       if (result.error) {
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

const getUserInvites = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(UserInvites:getUserInvites)",
         userInvitesModel.getUserInvites
      );
       if (result.error) {
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

module.exports = {
   create,
   update,
   getUserInvites,
};
