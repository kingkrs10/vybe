const offersModel = require("./model");
const commonModel = require("../common/common");
const responseController = require("../common/ResponseController");
const { v4: uuidv4 } = require("uuid");
const _map = require('lodash/map');
const _isEmpty = require('lodash/isEmpty');
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
         responseController.sendSuccessResponse(response, result.data)
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
         if (!_isEmpty(result.data)) {
            const offerIds = result.data.map(item => item.offerId);
            const resultHashTagData = await commonModel.tryBlock(
               offerIds,
               "(Offers:gethashTahs)",
               offersModel.getHashTags
            );
            const resultData = _map(result.data, (item) =>{
               const hashtagData = resultHashTagData.filter(i => i.offerId === item.offerId);
                  item.hasTags = hashtagData;
                  return item;
               });
            responseController.sendSuccessResponse(response, resultData);
         } else {
            responseController.sendNoContentResponse(response)
         }
      } else {
         responseController.sendInternalErrorResponse(response, { message: result.message })
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getAllOffers = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.query,
         "(Offers:getAllOffers)",
         offersModel.getAllOffers
      );
      if (!result.error){
         if (!_isEmpty(result.data)){
            const offerIds = result.data.map(item => item.offerId);
            const resultHashTagData = await commonModel.tryBlock(
               offerIds,
               "(Offers:gethashTahs)",
               offersModel.getHashTags
            );
            const resultData = _map(result.data, (item) =>{
               const hashtagData = resultHashTagData.filter(i => i.offerId === item.offerId);
                  item.hasTags = hashtagData;
                  return item;
            });
            responseController.sendSuccessResponse(response, resultData)
         } else {
            responseController.sendNoContentResponse(response)
         }
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
   console.log('saveFavorites', request.query);
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
   console.log('saveReport', request.query);
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

const getCategories = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.query,
         "(Offers:getAllCategories)",
         offersModel.getAllCategories
      );
      console.log('result', result);
      if (!result.error){
         if (!_isEmpty(result.data)){
            responseController.sendSuccessResponse(response, result.data)
         } else{
            responseController.sendNoContentResponse(response)
         }
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getAllLocation = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.query,
         "(Offers:getAllLocation)",
         offersModel.getAllLocation
      );
      console.log('result', result);
      if (!result.error) {
         if (!_isEmpty(result.data)) {
            responseController.sendSuccessResponse(response, result.data)
         } else {
            responseController.sendNoContentResponse(response)
         }
      } else {
         responseController.sendInternalErrorResponse(response)
      }
   } catch (err) {
      responseController.sendInternalErrorResponse(response, { message: err.toString() })
   }
};

module.exports = {
   create,
   getAll,
   getAllOffers,
   getOne,
   update,
   remove,
   saveFavorites,
   saveReport,
   getCategories,
   getAllLocation
};
