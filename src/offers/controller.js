const offersModel = require("./model");
const commonModel = require("../common/common");
const responseController = require("../common/ResponseController");
const { v4: uuidv4 } = require("uuid");

const create = async (request, response) => {
   try {
      const offerId = uuidv4();
      var imagePath = null;
      if (request.file) {
         const result = await commonModel.fileUpload(
            request.file,
            offerId,
            "offers"
         );
         imagePath = result.fileLocation ? result.fileLocation : null;
      }
      const tempBody = {
         ...request.body,
         imageURl: imagePath,
         offerId: offerId,
      };
      const result = await commonModel.tryBlock(
         tempBody,
         "(Offers:create)",
         offersModel.create
      );
      if (!result.error){
         responseController.sendSuccessResponse(response, result)
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const update = async (request, response, next) => {
   try {
      const data = {
         reqObj: request.body,
         offerId: request.params.id,
      };
      if (request.file) {
         const result = await commonModel.fileUpload(
            request.file,
            request.params.id,
            "offers"
         );
         if (result.fileLocation) {
            data.reqObj.imageURl = result.fileLocation;
         }
      }
      const result = await commonModel.tryBlock(
         data,
         "(Offers:update)",
         offersModel.update
      );
      if (!result.error){
         responseController.sendSuccessResponse(response, result.data)
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getAll = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Offers:getAll)",
         offersModel.getAll
      );
      if (!result.error){
         responseController.sendSuccessResponse(response, result['data'])
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getOne = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(Offers:getOne)",
         offersModel.getOne
      );
      if (!result.error){
         responseController.sendSuccessResponse(response, result)
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const remove = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(Offers:remove)",
         offersModel.remove
      );
      if (!result.error){
         responseController.sendSuccessResponse(response, result)
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const saveFavorites = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Offers:saveFavorites)",
         offersModel.saveFavorites
      );
      if (!result.error){
         responseController.sendSuccessResponse(response)
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const saveReport = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Offers:saveReport)",
         offersModel.saveReport
      );
      if (!result.error){
         responseController.sendSuccessResponse(response)
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

module.exports = {
   create,
   getAll,
   getOne,
   update,
   remove,
   saveFavorites,
   saveReport,
};
