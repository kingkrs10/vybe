const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const productsModel = require("./model");
const CollectionsModel = require("../shopCollections/model");
const commonModel = require("../common/common");
const {
   sendErrorResponse, sendCreatedResponse, sendInternalErrorResponse,
   sendNoContentResponse, sendSuccessResponse
} = require("../common/ResponseController");

const create = async (request, response) => {
   try{
      const productId = uuidv4();
      const tempBody = {...request.body, productId: productId}
      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:create)",
         productsModel.create
      )

      if(result.error){
         sendErrorResponse(response,result.message);
      } else {
         const result1 = await commonModel.tryBlock (
            {id: productId},
            "(Products:getOne)",
            productsModel.getOne
         )
         sendCreatedResponse(response, result1.data);
      }

   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const update = async (request, response) => {
   try{
      const tempBody = {...request.body, productId:request.params.id}
      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:update)",
         productsModel.update
      )
      if(result.error){
         sendErrorResponse(response,result.message);
      } else{
         const result1 = await commonModel.tryBlock (
            {id: request.params.id},
            "(Products:getOne)",
            productsModel.getOne
         )
         sendSuccessResponse(response, result1.data);
      }
   } catch (error){
       sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const getAll = async (request, response) => {
   try{
      const tempBody = { ...request.query,...request.currentUser}
      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:getAll)",
         productsModel.getAll
      )

      if(result.error){
         sendErrorResponse(response,result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response,result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
         sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const getOne = async (request, response) => {
   try{
      const tempBody = {id:request.params.id}
      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:getOne)",
         productsModel.getOne
      )
      if(result.error){
         sendErrorResponse(response,result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const getShopProducts = async (request, response) => {
   try{
      const result = await commonModel.tryBlock (
         {shopId: request.params.shopId},
         "(Products:getOne)",
         productsModel.getAll
      )

      if(result.error){
         sendErrorResponse(response,result.message);
      } else if (!_isEmpty(result.data)){
         const colectionResult = await commonModel.tryBlock (
            {shopId: request.params.shopId},
            "(Products:getOne)",
            CollectionsModel.getAll
         )
         var resultData = [];

         if(!colectionResult.error){
            colectionResult.data.map(item => {
               const tempArr = result.data.filter(i => i.shopCollectionId === item.shopCollectionId).slice(0, 4);
               resultData.push({collectionName: item.collectionName, shopCollectionId: item.shopCollectionId, products: tempArr});
            })
         } else {
            resultData = [...result.data];
         }
         sendSuccessResponse(response, resultData);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const getShopCollectionProducts = async (request, response) => {
   try{
      const tempBody =  {shopId: request.params.shopId, collectionId: request.params.collectionId};

      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:getShopCollectionProducts)",
         productsModel.getAll
      )
      if(result.error){
         sendErrorResponse(response,result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response,result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const remove = async (request, response) => {
   try{
      const tempBody = {...request.body, id:request.params.id}
      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:remove)",
         productsModel.remove
      )
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!result.error) {
         sendSuccessResponse(response, result);
      } else {
         sendInternalErrorResponse(response);
      }
   } catch (error){
       sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const productAvailabilty = async (request, response) => {
   try{
      const tempBody = {...request.body}
      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:productAvailabilty)",
         productsModel.productAvailabilty
      )
      if(result.error){
         sendErrorResponse(response,result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response,result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const relativeProducts = async (request, response) => {
   try{
      const tempBody = {...request.body}
      const result = await commonModel.tryBlock (
         {categoryItemId: request.params.categoryItemId},
         "(Products:relativeProducts)",
         productsModel.relativeProducts
      )
      if(result.error){
         sendErrorResponse(response,result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response,result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const homepageProducts = async (request, response) => {
   try{
      const tempBody = {
         ...request.currentUser,
         ...request.query,
         pageNo: request.query.pageNo || 1
      }
      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:homepageProducts)",
         productsModel.homepageProducts
      )
      if(result.error){
         sendErrorResponse(response,result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response,result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, {message: err.toString()});
   }
};

module.exports = {
   create,
   update,
   getAll,
   getOne,
   remove,
   getShopProducts,
   productAvailabilty,
   relativeProducts,
   getShopCollectionProducts,
   homepageProducts
}