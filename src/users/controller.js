const usersModel = require("./model");
const commonModel = require("../common/common");
const responseController = require("../common/ResponseController");
const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const create = async (request, response) => {
   try {
      const userId = uuidv4();

      var imagePath = null;
      // if (request.file) {
      //    const result = await commonModel.fileUpload(
      //       request.file,
      //       userId,
      //       "profile"
      //    );
      //    imagePath = result.fileLocation ? result.fileLocation : null;
      // }
      if (!_isEmpty(request.body.profileImage)) {
         imagePath = request.body.profileImage;
      }
      const tempBody = { ...request.body, imageURl: imagePath, uid: userId };
      const result = await commonModel.tryBlock(
         tempBody,
         "(User:create)",
         usersModel.create
      );
      if (!result.error) {
         responseController.sendSuccessResponse(response, result['data'])
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const getAll = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.query,
         "(User:getAll)",
         usersModel.getAll
      );
      if (!_isEmpty(result.data)) {
         responseController.sendSuccessResponse(response, result.data)
      } else {
         responseController.sendNoContentResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const getOne = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         { id: request.params.id },
         "(User:getOne)",
         usersModel.getOne
      );
      if (!_isEmpty(result.data)) {
         responseController.sendSuccessResponse(response, result.data)
      } else {
         responseController.sendNoContentResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const update = async (request, response, next) => {
   try {
      const data = {
         reqObj: request.body,
         uid: request.params.id,
      };
      // if (request.file) {
      //    const result = await commonModel.fileUpload(
      //       request.file,
      //       request.params.id,
      //       "profile"
      //    );
      //    if (result.fileLocation) {
      //       data.reqObj.imageURl = result.fileLocation;
      //    }
      // }
      if (!_isEmpty(request.body.profileImage)) {
         data.reqObj.imageURl = request.body.profileImage;
      }
      const result = await commonModel.tryBlock(
         data,
         "(User:update)",
         usersModel.update
      );
      if (!result.error) {
         responseController.sendSuccessResponse(response, result['data'])
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const remove = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(User:remove)",
         usersModel.remove
      );
      if (!result.error) {
         responseController.sendSuccessResponse(response, result)
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
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
      if (!result.error) {
         responseController.sendSuccessResponse(response, result['data'])
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
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
      if (!result.error) {
         responseController.sendSuccessResponse(response, result['data'])
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const getAuthToken = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         { phoneNumber: request.params.phoneNumber },
         "(User:getAuthToken)",
         usersModel.getOne
      );
      const JwtToken = await commonModel.createJwtToken(result.data);
      if (!_isEmpty(result.data)) {
         responseController.sendSuccessResponse(response, { authToken: JwtToken })
      } else {
         responseController.sendNoContentResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const getRecentUsers = async (request, response, next) => {
   try {
      const reqObj = {
         ...request.query,
         recentUsers: true
      }
      const result = await commonModel.tryBlock(
         reqObj,
         "(User:getRecentUsers)",
         usersModel.getAll
      );
      if (!_isEmpty(result.data)) {
         responseController.sendSuccessResponse(response, result.data)
      } else {
         responseController.sendNoContentResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
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
   getRecentUsers
};
