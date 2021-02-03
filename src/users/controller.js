const usersModel = require("./model");
const commonModel = require('../common/common');
const { v4: uuidv4 } = require('uuid');


const create = async (request, response) => {
	try {
		const userId = uuidv4();
		var  imagePath = null;
		if (request.file) {
			const result = await commonModel.fileUpload(request.file, userId, 'profile');
			imagePath = result.fileLocation ? result.fileLocation : null;
		}
		const tempBody = { ...request.body, imageURl: imagePath, uid: userId};
		const result = await commonModel.tryBlock(tempBody, '(User:create)', usersModel.create);
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
		const result = await commonModel.tryBlock(request.query, '(User:getAll)', usersModel.getAll);
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
		const result = await commonModel.tryBlock(request.params.id, '(User:getOne)', usersModel.getOne);
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
			uid: request.params.id
		}
		if (request.file) {
			const result = await commonModel.fileUpload(request.file, request.params.id, 'profile');
			if (result.fileLocation){
				data.reqObj.imageURl = result.fileLocation;
			}
		}
		const result = await commonModel.tryBlock(data, '(User:update)', usersModel.update);
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
		const result = await commonModel.tryBlock(request.params.id, '(User:remove)', usersModel.remove);
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

const updateLocation = async (request, response, next) => {
	const data = {
		reqObj: request.body,
		uid: request.params.id
	}
	try {
		const result = await commonModel.tryBlock(data, '(User:updateLocation)', usersModel.updateLocation);
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

const updateBlockedUsers = async (request, response, next) => {
	const data = {
		reqObj: request.body,
		uid: request.params.id
	}
	try {
		const result = await commonModel.tryBlock(data, '(User:updateBlockedUsers)', usersModel.updateBlockedUsers);
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

const saveUserInvites = async (request, response, next) => {
	try {
		const result = await commonModel.tryBlock(request.body, '(User:saveUserInvites)', usersModel.saveUserInvites);
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

const updateUserInvites = async (request, response, next) => {
	const data = {
		reqObj: request.body,
		uid: request.params.id
	}
	try {
		const result = await commonModel.tryBlock(data, '(User:updateUserInvites)', usersModel.updateUserInvites);
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
	updateLocation,
	updateBlockedUsers,
	saveUserInvites,
	updateUserInvites,
};
