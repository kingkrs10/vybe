const { v4: uuidv4 } = require("uuid");
const _map = require("lodash/map");
const _isEmpty = require("lodash/isEmpty");
const client = require("@sendgrid/mail");
const { sendgrid } = require("../config/config");
client.setApiKey(sendgrid);

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
    const message = {
      personalizations: [
        {
          to: [
            {
              email: request.email,
              name: request.name,
            },
          ],
        },
      ],
      from: {
        email: "hello@vybe.vents",
        name: "Hello from Vybe",
      },
      subject: "Your VYBE Ticket Order Confirmation",
      mailSettings: {
        bypassListManagement: {
          enable: false,
        },
        footer: {
          enable: false,
        },
        sandboxMode: {
          enable: false,
        },
      },
      trackingSettings: {
        clickTracking: {
          enable: true,
          enableText: false,
        },
        openTracking: {
          enable: true,
          substitutionTag: "%open-track%",
        },
        subscriptionTracking: {
          enable: false,
        },
        template_id: "d-f4a57e96d1b84d83af0482c8e63a629a",
        dynamic_template_data: {
          name: request.name,
          email: request.email,
          guestlist: request.guests,
          subtotal: request.total.subtotal,
          total: request.total.total,
        },
      },
    };

    client
      .send(message)
      .then(() => console.log("Mail sent successfully"))
      .catch((error) => {
        console.error(error);
      });
    // const eventId = uuidv4();
    // //  console.log(request.body);
    // const tempBody = {
    //   ...request.body,
    //   // userId: request.currentUser,
    //   eventId: eventId,
    // };
    // console.log(tempBody);
    // const result = await commonModel.tryBlock(
    //   tempBody,
    //   "(Events:create)",
    //   eventsModel.create
    // );
    // if (result.error) {
    //   sendErrorResponse(response, result.message);
    // } else if (!_isEmpty(result.data)) {
    //   sendCreatedResponse(response, result.data);
    // } else {
    //   sendInternalErrorResponse(response);
    // }
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
