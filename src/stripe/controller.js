const commonModel = require("../common/common");
const config = require("../config/config");
const userModel = require("../users/model");
const Stripe = require("stripe");
const {
  sendErrorResponse,
  sendInternalErrorResponse,
  sendSuccessResponse,
} = require("../common/ResponseController");

const stripe = Stripe(config.stripe_api_key);

const createCustomer = async (request, response, next) => {
  // console.log(request);
  try {
    await stripe.customers
      .create({
        name: request.body.name,
        source: request.body.token,
        phone: request.body.phone,
        description: request.body.name,
      })
      .then(async (res) => {
        const tempBody = {
          ...request.body,
          uid: request.currentUser.userId,
          stripeCustomerId: res.id,
        };
        // console.log(tempBody);
        const result = await commonModel.tryBlock(
          tempBody,
          "(Stripe:createNewCustomer)",
          userModel.updateStripeId
        );
        // console.log(result);
        sendSuccessResponse(response, result);
      })
      .catch((err) => {
        sendErrorResponse(response, err.toString());
      });
  } catch (err) {
    sendInternalErrorResponse(response);
  }
};

const createCustomerCard = async (request, response, next) => {
  try {
    await stripe.customers
      .createSource(req.body.customer_Id, { source: req.body.token })
      .then((res) => {
        const result = {
          error: false,
          data: res,
          message: "Created customer's new card successfully",
        };
        sendSuccessResponse(response, result);
      })
      .catch((err) => {
        sendErrorResponse(response, err.toString());
      });
  } catch (err) {
    sendInternalErrorResponse(response);
  }
};

const getAllCardDetails = async (request, response, next) => {
  try {
    await stripe.customers
      .listSources(request.body.customer_Id, { object: "card", limit: 10 })
      .then((res) => {
        // console.log(res);
        const result = {
          error: false,
          data: res.data,
          message: "Get Customer's all card Details",
        };
        sendSuccessResponse(response, result);
      })
      .catch((err) => {
        sendErrorResponse(response, err.toString());
      });
  } catch (err) {
    sendInternalErrorResponse(response);
  }
};

const removeCustomerCard = async (request, response, next) => {
  try {
    await stripe.customers
      .deleteSource(request.params.id, request.params.cardId)
      .then((res) => {
        const result = {
          error: false,
          data: res,
          message: "Removed customer's card successfully",
        };
        sendSuccessResponse(response, result);
      })
      .catch((err) => {
        sendErrorResponse(response, err.toString());
      });
  } catch (err) {
    sendInternalErrorResponse(response);
  }
};

const updateDefaultPaymentCard = async (request, response, next) => {
  const { customer_Id, customerCard_Id } = request.body;
  try {
    await stripe.customers
      .update(customer_Id, { default_source: customerCard_Id })
      .then((res) => {
        const result = {
          error: false,
          data: res,
          message: "Updated default payment card successfully",
        };
        sendSuccessResponse(response, result);
      })
      .catch((err) => {
        sendErrorResponse(response, err.toString());
      });
  } catch (err) {
    sendInternalErrorResponse(response);
  }
};

const geCustomerDetails = async (request, response, next) => {
  try {
    await stripe.customers
      .retrieve(request.body.customer_Id)
      .then((res) => {
        // console.log(res);
        const result = {
          error: false,
          data: res,
          message: "Get Customer's Details",
        };
        sendSuccessResponse(response, result);
      })
      .catch((err) => {
        sendErrorResponse(response, err.toString());
      });
  } catch (err) {
    sendInternalErrorResponse(response);
  }
};

const payWithStripe = async (request, response, next) => {
  try {
    let checkData =
      request.body.cardId === ""
        ? {
            amount: request.body.amount * 100,
            currency: request.body.currency,
            customer: request.body.customer_Id,
          }
        : {
            amount: request.body.amount * 100,
            currency: request.body.currency,
            customer: request.body.customer_Id,
            card: request.body.cardId,
          };
    await stripe.charges
      .create(checkData)
      .then((result) => {
        sendSuccessResponse(response, result);
      })
      .catch((err) => {
        sendErrorResponse(response, err.toString());
      });
  } catch (err) {
    sendInternalErrorResponse(response);
  }
};

const paymentIntent = async (request, response, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });
    sendSuccessResponse(response, {
      client_secret: paymentIntent.client_secret,
    });
    // let checkData =
    //   request.body.cardId === ""
    //     ? {
    //         amount: request.body.amount * 100,
    //         currency: request.body.currency,
    //         customer: request.body.customer_Id,
    //       }
    //     : {
    //         amount: request.body.amount * 100,
    //         currency: request.body.currency,
    //         customer: request.body.customer_Id,
    //         card: request.body.cardId,
    //       };
    // await stripe.charges
    //   .create(checkData)
    //   .then((result) => {
    //     sendSuccessResponse(response, result);
    //   })
    //   .catch((err) => {
    //     sendErrorResponse(response, err.toString());
    //   });
  } catch (err) {
    sendInternalErrorResponse(response);
  }
};

module.exports = {
  createCustomer,
  createCustomerCard,
  getAllCardDetails,
  removeCustomerCard,
  updateDefaultPaymentCard,
  geCustomerDetails,
  payWithStripe,
  paymentIntent,
};
