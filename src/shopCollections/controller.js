const shopCollectionsModel = require("./model");
const commonModel = require("../common/common");
const {
   sendErrorResponse,
   sendCreatedResponse,
   sendInternalErrorResponse,
   sendNoContentResponse,
   sendSuccessResponse
} = require("../common/ResponseController");
const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const create = async (request, response) => {
   try{
      const shopCollectionId = uuidv4();
      const tempBody = { ...request.body, shopCollectionId: shopCollectionId }
      const result = await commonModel.tryBlock(
         tempBody,
         "(ShopCollections:create)",
         shopCollectionsModel.create
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else{
         const result1 = await commonModel.tryBlock(
            {id:request.params.id},
            "(ShopCollections:update : fetch updated data)",
            shopCollectionsModel.getOne
         )
         sendCreatedResponse(response, result1.data);
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
};

const update = async(request, response) => {
   const tempBody = {...request.body, id: request.params.id}
   try{
      const result = await commonModel.tryBlock(
         tempBody,
         "(ShopCollections:update)",
         shopCollectionsModel.update
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else{
         const result1 = await commonModel.tryBlock(
            {id:request.params.id},
            "(ShopCollections:update : fetch updated data)",
            shopCollectionsModel.getOne
         )
        if (!_isEmpty(result1.data)){
            sendSuccessResponse(response, result1.data)
         } else{
            sendNoContentResponse(response)
         }
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
}

const getAll = async(request, response) => {
   const tempBody = {...request.currentUser}
   try{
      const result = await commonModel.tryBlock(
         tempBody,
         "(ShopCollections:getAll)",
         shopCollectionsModel.getAll
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data)
      } else{
         sendNoContentResponse(response)
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
};

const getOne = async (request, response) =>{
   try{
      const tempBody = {id: request.params.id}
      const result = await commonModel.tryBlock(
         tempBody,
         "(ShopCollections:getOne)",
         shopCollectionsModel.getOne
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data)
      } else{
         sendNoContentResponse(response)
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
}

const getShopCollections = async (request, response) =>{
   try{
      const tempBody = {shopId: request.params.shopId}
      const result = await commonModel.tryBlock(
         tempBody,
         "(ShopCollections:getShopCollections)",
         shopCollectionsModel.getAll
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data)
      } else{
         sendNoContentResponse(response)
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
}

const remove = async(request, response) =>{
   try{
      const tempBody = {id:request.params.id}
      const result= await commonModel.tryBlock(
         tempBody,
         "(ShopCollections:remove)",
         shopCollectionsModel.remove
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else{
         sendSuccessResponse(response, result);
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
}

module.exports = {
   create,
   update,
   getAll,
   getOne,
   getShopCollections,
   remove
}