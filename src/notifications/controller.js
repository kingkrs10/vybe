const notificationsModel = require("./model");
const commonModel = require('../common/common');
const create = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.body, '(Notifications:create)', notificationsModel.create);
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


const getUsersNotification = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.params.id, '(Notifications:getUsersNotification)', notificationsModel.getUserInvites);
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
	getUsersNotification
};
