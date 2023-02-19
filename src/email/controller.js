const { v4: uuidv4 } = require("uuid");
const _map = require("lodash/map");
const _isEmpty = require("lodash/isEmpty");
const client = require("@sendgrid/mail");
const { sendgrid } = require("../config/config");
client.setApiKey(sendgrid);
const qrcode = require("qrcode");
const moment = require("moment");

// const eventsModel = require("./model");
// const usersModel = require("../users/model");
const commonModel = require("../common/common");
const {
  sendErrorResponse,
  sendCreatedResponse,
  sendInternalErrorResponse,
  sendSuccessResponse,
  sendNoContentResponse,
} = require("../common/ResponseController");

const sendTransaction = async (request, response) => {
  try {
    const message = {
      from: {
        email: "hello@vybe.events",
        name: "Hello from VYBE",
      },
      // reply_to: { email: "hello@vybe.events", name: "Hello from Vybe" },
      // subject: "Your VYBE Ticket Order Confirmation",
      personalizations: [
        {
          to: [
            {
              email: request.email,
              name: request.name,
            },
          ],
          dynamic_template_data: {
            name: request.name,
            email: request.email,
            guestlist: request.guests,
            subtotal: request.total.subtotal,
            total: request.total.total,
            date: moment(new Date(Date.now())).format("MMMM, Do YYYY — h:mm A"),
          },
        },
      ],
      template_id: "d-98e85d3ffc524683b9cc4944ab814480",
    };

    client
      .send(message)
      // .then(() => console.log("Mail sent successfully"))
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    sendInternalErrorResponse(response, { message: err.toString() });
  }
};

const sendTickets = async (request, response) => {
  try {
    let QRCode = await qrcode.toDataURL(request.guestlistId);
    const message = {
      from: {
        email: "hello@vybe.events",
        name: "Hello from VYBE",
      },
      personalizations: [
        {
          to: [
            {
              email: request.email,
              name: request.name,
            },
          ],
          dynamic_template_data: {
            name: request.name,
            email: request.email,
            transaction: request.transactionId,
            type: request.type,
            price: request.price,
            startDate: moment(request.startDate).format(
              "MMMM, Do YYYY — h:mm A"
            ),
            date: moment(new Date(Date.now())).format("MMMM, Do YYYY — h:mm A"),
          },
        },
      ],
      attachments: [
        {
          filename: "qrcode.png",
          type: "image/png",
          content: QRCode.replace("data:image/png;base64,", ""),
          content_id: "qrcode",
          cid: "qrcode",
          disposition: "inline",
          encoding: "base64",
        },
      ],
      template_id: "d-3860d05e3be443c285d3e8767f0a43af",
    };

    client
      .send(message)
      // .then(() => console.log("Mail sent successfully"))
      .catch((error) => {
        console.error(error);
      });
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
  sendTransaction,
  sendTickets,
  getAll,
  getAllEvents,
  getOne,
  update,
  remove,
};
