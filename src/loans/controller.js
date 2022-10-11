const { v4: uuidv4 } = require("uuid");
const _map = require("lodash/map");
const _isEmpty = require("lodash/isEmpty");

const loansModel = require("./model");
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
    const loanId = uuidv4();
    //  console.log(request.body);

    const tempBody = {
      ...request.body,
      // userId: request.currentUser,
      loanId: loanId,
    };

    //  console.log("request data " + JSON.stringify(request.body));

    const userBody = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      dateOfBirth: request.body.dateOfBirth,
      education: request.body.education,
      employer: request.body.employer,
      monthlyRent: parseInt(request.body.monthlyRent),
      monthlyIncome: parseInt(request.body.monthlyIncome),
      gender: request.body.gender,
      familyStatus: request.body.familyStatus,
      city: request.body.city,
      idMatch: request.body.idMatch,
      hasCar: request.body.hasCar,
      creditScore: request.body.creditScore,
    };

    const data = {
      reqObj: userBody,
      userId: request.body.userId,
    };

    const result = await commonModel.tryBlock(
      tempBody,
      "(Loans:create)",
      loansModel.create
    );

    const user = await commonModel.tryBlock(
      data,
      "(User:update)",
      usersModel.update
    );

    //  console.log("loan data " + JSON.stringify(result.data));
    //  console.log("user data " + JSON.stringify(user.data));

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
      "(Loans:update)",
      loansModel.update
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
  //   console.log(request);
  try {
    const result = await commonModel.tryBlock(
      { uid: request.query.uid, pageNo: request.query.pageNo },
      "(Loans:getAll)",
      loansModel.getAll
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
  //   console.log(request);
  try {
    const result = await commonModel.tryBlock(
      request,
      "(Loans:getOne)",
      loansModel.getOne
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

const remove = async (request, response, next) => {
  try {
    const result = await commonModel.tryBlock(
      request.params.id,
      "(Loans:remove)",
      loansModel.remove
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
