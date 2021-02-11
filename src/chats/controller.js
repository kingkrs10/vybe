const chatsModel = require("./model");
const msgModel = require("../messages/model");
const commonModel = require('../common/common');
const responseController = require("../common/ResponseController");

const create = async (request, response) => {
	try {
		const result = await commonModel.tryBlock(request.body, '(Chats:create)', chatsModel.create);
		if (!result.error) {
			const tempBody = { ...request.body, chatId: result.data.chatId };
			await commonModel.tryBlock(tempBody, '(Message:create)', msgModel.create);
		}
		if (!result.error){
         	responseController.sendSuccessResponse(response, result['data'])
		} else {
			responseController.sendInternalErrorResponse(response)
		}
	} catch (err) {
		responseController.sendInternalErrorResponse(response, { message: err.toString()})
	}
};

const getAll = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.body, '(Chats:getAll)', chatsModel.getAll);
		if (!result.error){
         responseController.sendSuccessResponse(response, result['data'])
      } else {
         responseController.sendInternalErrorResponse(response)
      }
	} catch (err) {
		responseController.sendInternalErrorResponse(response, { message: err.toString()})
	}
};

const getOne = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.params.id, '(Chats:getOne)', chatsModel.getOne);
		if (!result.error){
         responseController.sendSuccessResponse(response, result['data'])
      } else {
         responseController.sendInternalErrorResponse(response)
      }
	} catch (err) {
		responseController.sendInternalErrorResponse(response, { message: err.toString()})
	}
};

const remove = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.params.id, '(Chats:remove)', chatsModel.remove);
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
	getAll,
	getOne,
	remove,
};
