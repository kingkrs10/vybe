const offersModel = require("./model");
const commonModel = require('../common/common');
const { v4: uuidv4 } = require('uuid');

const create = async (request, response) => {
	try {
		const offerId = uuidv4();
		var  imagePath = null;
		if (request.file) {
			const result = await commonModel.fileUpload(request.file, offerId, 'offers');
			imagePath = result.fileLocation ? result.fileLocation : null;
		}
		const tempBody = { ...request.body, imageURl: imagePath, offerId: offerId};
		const result = await commonModel.tryBlock(tempBody, '(Offers:create)', offersModel.create);
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
			offerId: request.params.id
		}
		if (request.file) {
			const result = await commonModel.fileUpload(request.file, request.params.id, 'offers');
			if (result.fileLocation) {
				data.reqObj.imageURl = result.fileLocation;
			}
		}
		const result = await commonModel.tryBlock(data, '(Offers:update)', offersModel.update);
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
		const result = await commonModel.tryBlock(request.query, '(Offers:getAll)', offersModel.getAll);
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
		const result = await commonModel.tryBlock(request.params.id, '(Offers:getOne)', offersModel.getOne);
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
		const result = await commonModel.tryBlock(request.params.id, '(Offers:remove)', offersModel.remove);
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

const updateFavorites = async (request, response, next) => {
	const data = {
		reqObj: request.body,
		offerId: request.params.id
	}
	try {
		const result = await commonModel.tryBlock(data, '(Offers:updateFavorites)', offersModel.updateFavorites);
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
	updateFavorites
};
