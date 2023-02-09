const { v4: uuidv4 } = require("uuid");
const _map = require("lodash/map");
const _isEmpty = require("lodash/isEmpty");

const guestlistsModel = require("./model");
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
    const ticketId = uuidv4();
    //  console.log(request.body);

    const tempBody = {
      ...request.body,
      // userId: request.currentUser,
      ticketId: ticketId,
    };
    // console.log(tempBody);

    const result = await commonModel.tryBlock(
      tempBody,
      "(Tickets:create)",
      guestlistsModel.create
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
      reqObj: { ...request.body, currentUser: request.currentUser },
      offerId: request.params.id,
    };

    const result = await commonModel.tryBlock(
      data,
      "(Events:update)",
      guestlistsModel.update
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
  console.log(request);
  try {
    const result = await commonModel.tryBlock(
      { eventId: request.query.eventId, pageNo: request.query.pageNo },
      "(Events:getAll)",
      guestlistsModel.getAll
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
      guestlistsModel.getOne
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
      guestlistsModel.remove
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
  getOne,
  update,
  remove,
};
