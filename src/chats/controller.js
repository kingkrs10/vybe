const chatsModel = require("./model");
const msgModel = require("../messages/model");
const commonModel = require('../common/common');

const create = async (request, response) => {
	try {
		const result = await commonModel.tryBlock(request.body, '(Chats:create)', chatsModel.create);
		if (!result.error) {
			const tempBody = { ...request.body, chatId: result.data.chatId };
			await commonModel.tryBlock(tempBody, '(Message:create)', msgModel.create);
		}
		try {
			response.status(200).send(JSON.stringify(result));
		} catch (err) {
			// show error?
		}
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};

const getAll = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.body, '(Chats:getAll)', chatsModel.getAll);
		try {
			response.status(200).send(JSON.stringify(result));
		} catch (err) {
			// show error?
		}
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};

const getOne = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.params.id, '(Chats:getOne)', chatsModel.getOne);
		try {
			response.status(200).send(JSON.stringify(result));
		} catch (err) {
			// show error?
		}
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};

const remove = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.params.id, '(Chats:remove)', chatsModel.remove);
		try {
			response.status(200).send(JSON.stringify(result));
		} catch (err) {
			// show error?
		}
	} catch (err) {
		response.status(200).send(
			JSON.stringify({
				error: true,
				message: err.toString()
			})
		);
	}
};
module.exports = {
	create,
	getAll,
	getOne,
	remove,
};
