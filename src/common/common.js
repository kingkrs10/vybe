const pgHelper = require("./pgHelper");
const { v4: uuidv4 } = require("uuid");
const firebase = require("./firebase");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const _isUndefined = require("lodash/isUndefined");
const usersModel = require("../users/model");
const responseController = require("./ResponseController");

const {
  eventsTbl,
  usersTbl,
  usersBlockedUsersTbl,
  usersCountryCurrencyTbl,
  usersInvitesTbl,
  statusTbl,
  paymentMethodsTbl,
  transactionsTbl,
  notificationsTbl,
  currencyTbl,
  addressesTbl,
} = require("./tableSchemas");

const initQuery = `${eventsTbl} ${usersTbl} ${usersBlockedUsersTbl} ${usersCountryCurrencyTbl} ${usersInvitesTbl} ${statusTbl} ${paymentMethodsTbl} ${notificationsTbl} ${currencyTbl} ${transactionsTbl} ${addressesTbl}`;

const tryBlock = async (data, modelName, model) => {
  let client = null;
  try {
    client = await pgHelper.getClientFromPool();
  } catch (err) {
    throw err;
  }

  try {
    let result = {};
    result = await model(data, client);
    client.release();
    return result;
  } catch (error) {
    console.log(`error:${modelName})`, new Date(), error);
    client.release();
    throw error;
  }
};

// Decode Login User JWT token
const decodeJwtToken = async (token) => {
  const jwtDecode = jwt.verify(token, config.app.secretKey);
  return jwtDecode;
};

const createJwtToken = async (userData) => {
  const payload = {
    userId: userData.userId,
    firebaseUId: userData.uid,
    phoneNumber: userData.phoneNumber,
    logintime: Math.round(new Date().getTime() / 1000),
  };
  const token = jwt.sign(JSON.stringify(payload), config.app.secretKey);
  return token;
};

const authMiddleware = async (request, response, next) => {
  next();
  return;
  // const token = request.headers.authorization;
  // if (!_isUndefined(token)) {
  //   let authorization = token;
  //   if (token.includes("Bearer")) {
  //     authorization = token.split(" ")[1];
  //   }
  //   try {
  //     jwt.verify(authorization, config.app.secretKey, async (err, decoded) => {
  //       if (err) {
  //         responseController.sendNotAuthorizedResponse(response);
  //       }
  //       if (decoded) {
  //         const checkUserExist = await tryBlock(
  //           { id: decoded.userId },
  //           "(User:check auth Middleware)",
  //           usersModel.getOne
  //         );
  //         if (checkUserExist) {
  //           request.currentUser = decoded;
  //           next();
  //           return;
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     responseController.sendNotAuthorizedResponse(response);
  //   }
  // } else {
  //   responseController.sendNotAuthorizedResponse(response);
  // }
};

const dbInit = async () => {
  const client = await pgHelper.getClientFromPool();
  try {
    await client.query(initQuery);
  } catch (error) {
    console.log(error);
    throw error.message;
  } finally {
    client.release();
  }
};

module.exports = {
  tryBlock,
  decodeJwtToken,
  createJwtToken,
  authMiddleware,
  dbInit,
};
