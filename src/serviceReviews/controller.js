const _isEmpty = require("lodash/isEmpty");
const { v4: uuidv4 } = require("uuid");

const serviceReviewsModel = require("./model");
const commonModel = require("../common/common");
const {
  sendErrorResponse,
  sendCreatedResponse,
  sendInternalErrorResponse,
  sendNoContentResponse,
  sendSuccessResponse
} = require("../common/ResponseController");

const create = async (request, response) => {
  try {
    const tempBody = { ...request.body, serviceReviewId: uuidv4() };
    const result = await commonModel.tryBlock(
      tempBody,
      "(serviceReviews:create)",
      serviceReviewsModel.create
    );

 
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else {
      sendCreatedResponse(response, result.data);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const update = async (request, response) => {
  try {
    const tempBody = { ...request.body, serviceReviewId: request.params.id };
    const result = await commonModel.tryBlock(
      tempBody,
      "(serviceReviews:update)",
      serviceReviewsModel.update
    );

    if (result.error) {
      sendErrorResponse(response, result.message);
    } else {
      sendSuccessResponse(response, result.data);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const getAll = async (request, response) => {
  try {
    const tempBody = { serviceId: request.params.serviceId };
    const result = await commonModel.tryBlock(
      tempBody,
      "(serviceReviews:getAll)",
      serviceReviewsModel.getAll
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data);
    } else {
      sendNoContentResponse(response);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};
const getOne = async (request, response) => {
  try {
    const tempBody = {
      serviceId: request.params.serviceId,
      serviceReviewId: request.params.serviceReviewId
    };
    const result = await commonModel.tryBlock(
      tempBody,
      "(serviceReviews:getOne)",
      serviceReviewsModel.getOne
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data);
    } else {
      sendNoContentResponse(response);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};

const remove = async (request, response) => {
  try {
    const tempBody = {
      id: request.params.id
    };
    const result = await commonModel.tryBlock(
      tempBody,
      "(serviceReviews:remove)",
      serviceReviewsModel.remove
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!result.error) {
      sendSuccessResponse(response);
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
  remove
}
