const commonModel = require("../common/common");
const config = require("../config/config");
const userModel = require("../users/model");
const transactionsModel = require("../transactions/model");
const Stripe = require("stripe");
const {
  sendErrorResponse,
  sendInternalErrorResponse,
  sendSuccessResponse,
} = require("../common/ResponseController");

const stripe = Stripe(config.stripe_api_key);

const createCustomer = async (request, response, next) => {
  try {
    // console.log(request.body);
    await stripe.customers
      .create({
        name: request.body.name,
        email: request.body.email,
      })
      .then(async (res) => {
        // console.log(res);
        const tempBody = {
          ...request.body,
          // uid: request.userId,
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

const webhook = async (request, response, next) => {
  const event = request.body;

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      try {
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
      break;
    case "payment_method.attached":
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.json({ received: true });
};

const paymentIntent = async (request, response, next) => {
  // console.log(
  //   request.query.amount,
  //   request.query.currency,
  //   request.query.customer
  // );
  try {
    const intent = await stripe.paymentIntents.create({
      amount: request.query.amount,
      currency: request.query.currency,
      customer: request.query.customer,
      setup_future_usage: "off_session",
      automatic_payment_methods: { enabled: true },
    });
    // console.log(intent);
    sendSuccessResponse(response, {
      client_secret: intent.client_secret,
    });
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
  webhook,
};
