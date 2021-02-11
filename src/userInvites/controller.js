const userInvitesModel = require("./model");
const commonModel = require("../common/common");
const responseController = require("../common/ResponseController");

const create = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(UserInvites:create)",
         userInvitesModel.create
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
      if (!result.error){
         responseController.sendSuccessResponse(response, result['data'])
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getUserInvites = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(UserInvites:getUserInvites)",
         userInvitesModel.getUserInvites
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
   update,
   getUserInvites,
};
