const { v4: uuidv4 } = require("uuid");
const _map = require("lodash/map");
const _isEmpty = require("lodash/isEmpty");

const eventsModel = require("./model");
const usersModel = require("../users/model");
const commonModel = require("../common/common");
const {
  sendErrorResponse,
  sendCreatedResponse,
  sendInternalErrorResponse,
  sendSuccessResponse,
  sendNoContentResponse,
} = require("../common/ResponseController");

const create = async (request, response) => {
  try {
    const eventId = uuidv4();
    //  console.log(request.body);

    const tempBody = {
      ...request.body,
      // userId: request.currentUser,
      eventId: eventId,
    };
    // console.log(tempBody);

    const result = await commonModel.tryBlock(
      tempBody,
      "(Events:create)",
      eventsModel.create
    );

    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendCreatedResponse(response, result.data);
    } else {
      sendInternalErrorResponse(response);
    }
  } catch (err) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};

const update = async (request, response, next) => {
  try {
    const data = {
      ...request.body,
      eventId: request.params.id,
    };

    const result = await commonModel.tryBlock(
      data,
      "(Events:update)",
      eventsModel.update
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data);
    } else {
      sendInternalErrorResponse(response);
    }
  } catch (err) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};

const getAll = async (request, response, next) => {
  // console.log(request);
  try {
    const result = await commonModel.tryBlock(
      { uid: request.query.uid, pageNo: request.query.pageNo },
      "(Events:getAll)",
      eventsModel.getAll
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data);
    } else {
      sendNoContentResponse(response);
    }
  } catch (err) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};

const getAllEvents = async (request, response, next) => {
  // console.log(request);
  try {
    const result = await commonModel.tryBlock(
      { pageNo: request.query.pageNo },
      "(Events:getAll)",
      eventsModel.getAllEvents
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data);
    } else {
      sendNoContentResponse(response);
    }
  } catch (err) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};

const getOne = async (request, response, next) => {
  // console.log(request);
  try {
    const result = await commonModel.tryBlock(
      request,
      "(Events:getOne)",
      eventsModel.getOne
    );
    // console.log(result);
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data);
    } else {
      sendNoContentResponse(response);
    }
  } catch (err) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};

const remove = async (request, response, next) => {
  try {
    const result = await commonModel.tryBlock(
      request.params.id,
      "(Events:remove)",
      eventsModel.remove
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!result.error) {
      sendSuccessResponse(response, result);
    } else {
      sendInternalErrorResponse(response);
    }
  } catch (err) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};

module.exports = {
  create,
  getAll,
  getAllEvents,
  getOne,
  update,
  remove,
};
