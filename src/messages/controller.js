const messagesModel = require("./model");
const commonModel = require('../common/common');

const create = async (request, response) => {
	try {
		const result = await commonModel.tryBlock(request.body, '(Messages:create)', messagesModel.create);
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

const update = async (request, response, next) => {
	try {
		const data = {
			reqObj: request.body,
			messageId: request.params.id
		}
		const result = await commonModel.tryBlock(data, '(Messages:update)', messagesModel.update);
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
		const result = await commonModel.tryBlock(request.params, '(Messages:getAll)', messagesModel.getAll);
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
		const result = await commonModel.tryBlock(request.params.chatId, '(Messages:getOne)', messagesModel.getOne);
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

const updateUnRead = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.params.id, '(Messages:updateUnRead)', messagesModel.updateUnRead);
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
		const result = await commonModel.tryBlock(request.params.id, '(Messages:remove)', messagesModel.remove);
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
	update,
	remove,
	updateUnRead
};
