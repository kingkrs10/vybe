const _isEmpty = require('lodash/isEmpty');
const messagesModel = require("./model");
const commonModel = require("../common/common");
const {sendErroresponse, sendSuccessResponse, sendInternalErrorResponse, sendNoContentResponse} = require("../common/ResponseController");

const create = async (request, response) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Messages:create)",
         messagesModel.create
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

const update = async (request, response, next) => {
   try {
      const data = {
         reqObj: request.body,
         messageId: request.params.id,
      };
      const result = await commonModel.tryBlock(
         data,
         "(Messages:update)",
         messagesModel.update
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

const getAll = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params,
         "(Messages:getAll)",
         messagesModel.getAll
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result['data']);
		} else {
			sendNoContentResponse(response);
		}
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getOne = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.chatId,
         "(Messages:getOne)",
         messagesModel.getOne
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!result.error){
         sendSuccessResponse(response, result['data']);
		} else {
			sendNoContentResponse(response)
		}
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const updateUnRead = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(Messages:updateUnRead)",
         messagesModel.updateUnRead
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!result.error){
         sendSuccessResponse(response, result['data']);
		} else {
			sendInternalErrorResponse(response);
		}
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const remove = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(Messages:remove)",
         messagesModel.remove
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!result.error){
         sendSuccessResponse(response, result['data'])
		} else {
			sendInternalErrorResponse(response)
		}
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

module.exports = {
   create,
   getAll,
   getOne,
   update,
   remove,
   updateUnRead,
};
