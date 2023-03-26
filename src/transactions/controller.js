const { v4: uuidv4 } = require("uuid");
const _map = require("lodash/map");
const _isEmpty = require("lodash/isEmpty");
const transactionsModel = require("./model");
const guestlistsModel = require("../guestlists/model");
const emailController = require("../email/controller");
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
    const transactionId = uuidv4();

    const transactionBody = {
      ...request.body,
      transactionId: transactionId,
    };

    const transaction = await commonModel.tryBlock(
      transactionBody,
      "(Transactions:create)",
      transactionsModel.create
    );

    let guestlist_for_email = [];

    const guestlist = _map(request.body.guests, (guest) => {
      const data = {
        guestlistId: uuidv4(),
        ticketId: guest.ticketId,
        eventId: guest.eventId,
        transactionId: transactionId,
        name: guest.name,
        email: guest.email,
        type: guest.type,
        price: guest.price,
        startDate: guest.startDate,
        endDate: guest.endDate,
      };
      guestlist_for_email.push(data);
      // console.log(guestlist_for_email);
      return Object.values(data);
    });

    const guestsBody = {
      guests: guestlist_for_email,
      total: request.body.total,
      name: request.body.name,
      email: request.body.email,
      date: Date.now(),
    };

    if (transaction.data !== undefined) {
      const guestlists = await commonModel.tryBlock(
        guestlist,
        "(Guestlists:create)",
        guestlistsModel.create
      );

      await emailController.sendTransaction(guestsBody);

      guestlist_for_email.map(async (guest) => {
        await emailController.sendTickets(guest);
      });
    }

    if (transaction.error) {
      sendErrorResponse(response, transaction.message);
    } else if (!_isEmpty(transaction.data)) {
      sendCreatedResponse(response, transaction.data);
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
      "(Transactions:update)",
      transactionsModel.update
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
      { eventId: request.query.eventId, pageNo: request.query.pageNo },
      "(Transactions:getAll)",
      transactionsModel.getAll
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
      "(Transactions:getOne)",
      transactionsModel.getOne
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
      "(Transactions:remove)",
      transactionsModel.remove
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
