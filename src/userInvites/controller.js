const userInvitesModel = require("./model");
const commonModel = require('../common/common');
const create = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.body, '(UserInvites:create)', userInvitesModel.create);
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
	const data = {
		reqObj: request.body,
		uid: request.params.id
	}
	try {
		const result = await commonModel.tryBlock(data, '(UserInvites:update)', userInvitesModel.update);
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

const getUserInvites = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.params.id, '(UserInvites:getUserInvites)', userInvitesModel.getUserInvites);
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
	update,
	getUserInvites,
};
