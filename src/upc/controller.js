const { v4: uuidv4 } = require("uuid");
const _isEmpty = require("lodash/isEmpty");

const upcModel = require("./model");
const commonModel = require("../common/common");
const {
  sendErrorResponse,
  sendCreatedResponse,
  sendInternalErrorResponse,
  sendNoContentResponse,
  sendSuccessResponse,
} = require("../common/ResponseController");

const create = async (request, response) => {
  let result;
  try {
    const upcId = uuidv4();
    const tempBody = { ...request.body, upcId: upcId };

    result = await commonModel.tryBlock(
      tempBody,
      "(UPC:create)",
      upcModel.create
    );

    if (result.error) {
      sendErrorResponse(response, result.message);
    } else {
      const result1 = await commonModel.tryBlock(
        { id: productId },
        "(UPC:getOne)",
        upcModel.getOne
      );
      sendCreatedResponse(response, result1.data);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const update = async (request, response) => {
  try {
    const tempBody = { ...request.body, productId: request.params.id };
    const result = await commonModel.tryBlock(
      tempBody,
      "(UPC:update)",
      upcModel.update
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else {
      const result1 = await commonModel.tryBlock(
        { id: request.params.id },
        "(UPC:getOne)",
        upcModel.getOne
      );
      sendSuccessResponse(response, result1.data);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const getAll = async (request, response) => {
  try {
    const tempBody = { ...request.query, ...request.currentUser };
    const result = await commonModel.tryBlock(
      tempBody,
      "(UPC:getAll)",
      upcModel.getAll
    );

    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data);
    } else {
      sendNoContentResponse(response);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const getOne = async (request, response) => {
  try {
    const tempBody = { upcCode: request.params.upcCode };
    const result = await commonModel.tryBlock(
      tempBody,
      "(UPC:getOne)",
      upcModel.getOne
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data);
    } else {
      sendNoContentResponse(response);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const remove = async (request, response) => {
  try {
    const tempBody = { ...request.body, id: request.params.id };
    const result = await commonModel.tryBlock(
      tempBody,
      "(UPC:remove)",
      upcModel.remove
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!result.error) {
      sendSuccessResponse(response, result);
    } else {
      sendInternalErrorResponse(response);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

module.exports = {
  create,
  update,
  getAll,
  getOne,
  remove,
};
