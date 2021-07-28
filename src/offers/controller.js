const offersModel = require("./model");
const userModel = require("../users/model");
const commonModel = require("../common/common");
const {sendErroresponse, sendCreatedesponse, sendInternalErrorResponse, sendSuccessResponse, sendNoContentResponse } = require("../common/ResponseController");
const { v4: uuidv4 } = require("uuid");
const _map = require('lodash/map');
const _isEmpty = require('lodash/isEmpty');

const create = async (request, response) => {
   try {
      const offerId = uuidv4();
      var imagePath = null;
      var thumpImagePath = null;
      var mediumImagePath = null;
      // const imagePathArr = await fileUploadingProcess(request.files, offerId);
      if (!_isEmpty(request.body.offerImage)) {
         imagePath = request.body.offerImage;
      }
      if (!_isEmpty(request.body.offerThumpImage)) {
         thumpImagePath = request.body.offerThumpImageURL;
      }
      if (!_isEmpty(request.body.offerMediumImage)) {
         mediumImagePath = request.body.offerMediumImageURL;
      }
      const tempBody = {
         ...request.body,
         currentUser: request.currentUser,
         imageURl: imagePath,
         thumpImageURL: thumpImagePath,
         mediumImageURL: mediumImagePath,
         offerId: offerId,
      };
      const result = await commonModel.tryBlock(
         tempBody,
         "(Offers:create)",
         offersModel.create
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         sendCreatedesponse(response, result.data);
      } else {
         sendInternalErrorResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const fileUploadingProcess = async (filesData, offerId) => {
   const fileNameArr = [];
   await filesData.map( async fileItem => {
      const resp = await commonModel.fileUpload(
         fileItem,
         offerId,
         "offers"
      );
      fileNameArr.push(resp.fileLocation);
   })
   return fileNameArr;
}

const update = async (request, response, next) => {
   try {
      var imagePath = null;
      var thumpImagePath = null;
      var mediumImagePath = null;
      // const imagePathArr = await fileUploadingProcess(request.files, offerId);
      if (!_isEmpty(request.body.offerImage)) {
         imagePath = request.body.offerImage;
      }
      if (!_isEmpty(request.body.offerThumpImage)) {
         thumpImagePath = request.body.offerThumpImageURL;
      }
      if (!_isEmpty(request.body.offerMediumImage)) {
         mediumImagePath = request.body.offerMediumImageURL;
      }
      const data = {
         reqObj: {
            ...request.body,
            imageURl: imagePath,
            thumpImageURL: thumpImagePath,
            mediumImageURL: mediumImagePath,
            currentUser: request.currentUser,
         },
         offerId: request.params.id,
      };
      const result = await commonModel.tryBlock(
         data,
         "(Offers:update)",
         offersModel.update
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         sendSuccessResponse(response, result.data)
      } else {
         sendInternalErrorResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getAll = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Offers:getAll)",
         offersModel.getAll
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
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
         sendSuccessResponse(response, resultData);
      } else {
         sendNoContentResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getAllOffers = async (request, response, next) => {
   try {
      const tempObj = {
         ...request.query,
         ...request.currentUser,
         userId: request.currentUser.userId
      }
      const result = await commonModel.tryBlock(
         tempObj,
         "(Offers:getAllOffers)",
         offersModel.getAllOffers
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
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
         sendSuccessResponse(response, resultData)
      } else {
         sendNoContentResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getOne = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request,
         "(Offers:getOne)",
         offersModel.getOne
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)){
         const offerIds = [result.data.offerId];
         const resultHashTagData = await commonModel.tryBlock(
            offerIds,
            "(Offers:gethashTahs)",
            offersModel.getHashTags
         );
         result.data.hasTags = resultHashTagData;
         sendSuccessResponse(response, result.data);
      } else {
         sendNoContentResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const remove = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.params.id,
         "(Offers:remove)",
         offersModel.remove
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!result.error){
         sendSuccessResponse(response, result)
      } else {
         sendInternalErrorResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const saveFavorites = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Offers:saveFavorites)",
         offersModel.saveFavorites
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!result.error){
         sendSuccessResponse(response)
      } else {
         sendInternalErrorResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const saveReport = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.body,
         "(Offers:saveReport)",
         offersModel.saveReport
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!result.error){
         sendSuccessResponse(response)
      } else {
         sendInternalErrorResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getCategories = async (request, response, next) => {
   const tempbody = {
      ...request.query,
      ...request.currentUser
   }
   try {
      const result = await commonModel.tryBlock(
         tempbody,
         "(Offers:getAllCategories)",
         offersModel.getAllCategories
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data);
      } else{
         sendNoContentResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString()})
   }
};

const getAllLocation = async (request, response, next) => {
   try {
      const result = await commonModel.tryBlock(
         request.query,
         "(Offers:getAllLocation)",
         offersModel.getAllLocation
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data)
      } else {
         sendNoContentResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const getUserOffers = async (request, response, next) => {
   const data = {
      ...request.currentUser,
      uid: request.params.id,
      pageNo: request.query.pageNo || 1
   }

   try {
      const result = await commonModel.tryBlock(
         data,
         "(Offers:getUserOffers)",
         offersModel.getAllOffers
      );

      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         const offerIds = result.data.map(item => item.offerId);
         const resultHashTagData = await commonModel.tryBlock(
            offerIds,
            "(Offers:gethashTags)",
            offersModel.getHashTags
         );
         const resultData = _map(result.data, (item) => {
            const hashtagData = resultHashTagData.filter(i => i.offerId === item.offerId);
            item.hasTags = hashtagData;
            return item;
         });
         sendSuccessResponse(response, resultData);
      } else {
         sendNoContentResponse(response);
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() });
   }
};

const getUserfavorites = async (request, response, next) => {
   const data = {
      ...request.currentUser,
      pageNo: request.query?.pageNo || 1,
      favoriteUid: request.params.id
   }
   try {
      const result = await commonModel.tryBlock(
         data,
         "(Offers:getUserfavorites)",
         offersModel.getUserfavorites
      );

      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         const offerIds = result.data.map(item => item.offerId);
         const resultHashTagData = await commonModel.tryBlock(
            offerIds,
            "(Offers:gethashTahs)",
            offersModel.getHashTags
         );
         const resultData = _map(result.data, (item) => {
            const hashtagData = resultHashTagData.filter(i => i.offerId === item.offerId);
            item.hasTags = hashtagData;
            return item;
         });
         sendSuccessResponse(response, resultData)
      } else {
         sendNoContentResponse(response)
      }
   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() })
   }
};

const getOfferFavoriters = async (request, response, next) => {
   const data = {
      ...request.currentUser,
      uid: request.params.id
   }
   try {
      const result = await commonModel.tryBlock(
         data,
         "(Offers:getOfferFavoriters)",
         offersModel.getOfferFavoriters
      );

      if (result.error) {
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         const resData = []
         const offerIds = []
         await Promise.all(result.data.map(item => {
            offerIds.push(item.offerId);
            var checkData = resData.filter(i => i.offerId === item.offerId);
            if(checkData.length === 0){
               resData.push(item);
            }
         }));
         const resultOfferFavoritersData = await commonModel.tryBlock(
            offerIds,
            "(Offers:getOfferFavoritersDetails)",
            userModel.getOfferFavoritersDetails
         );
         const resultData = _map(resData, (item) => {
            const offerData = resultOfferFavoritersData.filter(i => i.offerId === item.offerId);
            item.offerFavoriters = offerData;
            return item;
         });
         sendSuccessResponse(response, resultData);
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
   getAllOffers,
   getOne,
   update,
   remove,
   saveFavorites,
   saveReport,
   getCategories,
   getAllLocation,
   getUserOffers,
   getUserfavorites,
   getOfferFavoriters
};
