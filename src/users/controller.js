const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const usersModel = require("./model");
const userCountryCurrencyModel = require("../countryCurrency/model");
const commonModel = require("../common/common");
const {sendErrorResponse, sendCreatedResponse, sendInternalErrorResponse, sendNoContentResponse, sendSuccessResponse } = require("../common/ResponseController");

const { firebaseAdmin } = require("../common/firebase");

const create = async (request, response) => {
   try {
      const userId = uuidv4();
      var imagePath = null;
      var mediumImagePath = null;
      var thumpImagePath = null;

      if (!_isEmpty(request.body.profileImage)) {
         imagePath = request.body.profileImage;
      }

      if (request.body.profileMediumImage && !_isEmpty(request.body.profileMediumImage)) {
         mediumImagePath = request.body.profileMediumImage;
      }

      if (request.body.profileThumpImage && !_isEmpty(request.body.profileThumpImage)) {
         thumpImagePath = request.body.profileThumpImage;
      }

      const tempBody = { ...request.body, imageURl: imagePath, userMediumImage:mediumImagePath, userThumpImage: thumpImagePath, uid: userId };
      const result = await commonModel.tryBlock(
         tempBody,
         "(User:create)",
         usersModel.create
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

const getAll = async (request, response, next) => {
   const reqObj = {
      ...request.query,
      ...request.currentUser
   }
   try {
      const result = await commonModel.tryBlock(
         reqObj,
         "(User:getAll)",
         usersModel.getAll
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
   try {
      const result = await commonModel.tryBlock(
         { id: request.params.id },
         "(User:getOne)",
         usersModel.getOne
      );
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         const resUserCountryCurrency = await commonModel.tryBlock(
            result.data.userid,
            "(Offers:getUserCountryCurrency)",
            userCountryCurrencyModel.getUserCountryCurrency
         );
         const resultData = {
            ...result.data, countryCurrency: resUserCountryCurrency.data,
            currencyDetails: { code: result.data.currencyCode, symbol: result.data.currencySymbol }};

         sendSuccessResponse(response, resultData);
      } else {
         sendNoContentResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() });
   }
};

const update = async (request, response, next) => {
   try {
      firebaseAdmin.auth().updateUser(request.params.id, { phoneNumber: request.body.phoneNumber })
         .then(async function (userRecord) {
            const data = {
               reqObj: request.body,
               uid: request.params.id,
            };

            if (!_isEmpty(request.body.profileImage)) {
               data.reqObj.imageURl = request.body.profileImage;
            }

            if (request.body.profileMediumImage && !_isEmpty(request.body.profileMediumImage)) {
               data.reqObj.medium_imageURL = request.body.profileMediumImage;
            }

            if (request.body.profileThumpImage && !_isEmpty(request.body.profileThumpImage)) {
               data.reqObj.thump_imageURL = request.body.profileThumpImage;
            }

            const result = await commonModel.tryBlock(
               data,
               "(User:update)",
               usersModel.update
            );
            if (result.error) {
               sendErrorResponse(response, result.message);
            } else if (!result.error) {
               sendSuccessResponse(response, result['data'])
            } else {
               sendInternalErrorResponse(response)
            }
         })
         .catch(function (error) {
            sendInternalErrorResponse(response)
         });
   } catch (error) {
      sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const remove = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(User:remove)",
         usersModel.remove
      );
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!result.error) {
         sendSuccessResponse(response, result);
      } else {
         sendInternalErrorResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const updateLocation = async (request, response, next) => {
   const data = {
      reqObj: request.body,
      uid: request.params.id,
   };
   try {
      const result = await commonModel.tryBlock(
         data,
         "(User:updateLocation)",
         usersModel.updateLocation
      );
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!result.error) {
         sendSuccessResponse(response, result['data'])
      } else {
         sendInternalErrorResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const updateBlockedUsers = async (request, response, next) => {
   const data = {
      reqObj: request.body,
      uid: request.params.id,
   };
   try {
      const result = await commonModel.tryBlock(
         data,
         "(User:updateBlockedUsers)",
         usersModel.updateBlockedUsers
      );
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!result.error) {
         sendSuccessResponse(response)
      } else {
         sendInternalErrorResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const getAuthToken = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         { phoneNumber: request.params.phoneNumber },
         "(User:getAuthToken)",
         usersModel.getOne
      );
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         const JwtToken = await commonModel.createJwtToken(result.data);
         sendSuccessResponse(response, { authToken: JwtToken })
      } else {
         sendNoContentResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const getRecentUsers = async (request, response, next) => {
   try {
      const reqObj = {
         ...request.query,
         ...request.currentUser,
         recentUsers: true
      }
      const result = await commonModel.tryBlock(
         reqObj,
         "(User:getRecentUsers)",
         usersModel.getAll
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

const updateStripeId = async (request, response, next) => {
   try {
      const reqObj = {
         ...request.body,
         uid: request.params.id,
         currentUser:request.currentUser,
      }
      const result = await commonModel.tryBlock(
         reqObj,
         "(User:updateStripeId)",
         usersModel.updateStripeId
      );
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else {
         sendSuccessResponse(response, {});
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() });
   }
};

const getBlockedUsers = async (request, response, next) => {
   try {
      const reqObj = {
         ...request.params,
         ...request.currentUser,
         recentUsers: true
      }
      const result = await commonModel.tryBlock(
         reqObj,
         "(User:getBlockedUsers)",
         usersModel.getBlockedUsers
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

module.exports = {
   create,
   getAll,
   getOne,
   update,
   remove,
   updateLocation,
   updateBlockedUsers,
   getAuthToken,
   getRecentUsers,
   updateStripeId,
   getBlockedUsers
};
