const orderItemsModel = require('./model');
const commonModel = require("../common/common");
const {
   sendErrorResponse, sendCreatedResponse, sendInternalErrorResponse,
   sendNoContentResponse, sendSuccessResponse
} = require("../common/ResponseController");
const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const create = async (request, response) => {
   try{
      const orderItemId = uuidv4();
      const tempBody = {...request.body, orderItemId: orderItemId}
      const result = await commonModel.tryBlock(
         tempBody,
         "(orderItems:create)",
         orderItemsModel.create
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else{
         const result1 = await commonModel.tryBlock(
            {orderItemId:orderItemId, userId: request.body.userId},
            "(orderItems:create : getOne)",
            orderItemsModel.getOne
         );
         sendSuccessResponse(response, result1.data);

      }
   } catch (error){
      sendInternalErrorResponse(response, {message: error.toString()});
   }
};

const update = async (request, response) => {
   try{
      const tempBody = {...request.body, orderItemId:request.params.Id}
      const result = await commonModel.tryBlock(
         tempBody,
         "(orderItems:update)",
         orderItemsModel.update
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else{
         const result1 = await commonModel.tryBlock(
            {orderItemId: request.params.Id, userId: request.body.userId},
            "(orderItems:update : getOne)",
            orderItemsModel.getOne
         );
         const data = result1 || null;
         sendSuccessResponse(response, data);
      }
   } catch (error){
      sendInternalErrorResponse(response, {message: error.toString()});
   }
};

const getCardDetails = async (request, response) => {
   try{
      const tempBody = {...request.currentUser}
      const result = await commonModel.tryBlock(
         tempBody,
         "(orderItems:getCardDetails)",
         orderItemsModel.getCardDetails
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, {message: error.toString()});
   }
};

const getAll = async (request, response) => {
   try{
      const tempBody = { userId: request.currentUser.userId }
      const result = await commonModel.tryBlock(
         tempBody,
         "(orderItems:getAll)",
         orderItemsModel.getAll
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, {message: error.toString()});
   }
};

const getOne = async (request, response) => {
   try{
      const tempBody = {userId: request.params.userId ,orderItemId: request.params.orderItemId}
      const result = await commonModel.tryBlock(
         tempBody,
         "(orderItems:getOne)",
         orderItemsModel.getOne
      )
      if(result.error){
         sendErrorResponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data);
      } else{
         sendNoContentResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, {message: error.toString()});
   }
};


const remove = async (request, response) => {
   try{
      const result = await commonModel.tryBlock(
         { ...request.body},
         "(orderItems:remove)",
         orderItemsModel.remove
       )
       if(!_isEmpty(result)){
          sendSuccessResponse(response, null);
       }else{
         sendNoContentResponse(response, resultData);
       }
   } catch (error){
      sendInternalErrorResponse(response, {message: error.toString()});
   }
};

module.exports ={
   create,
   update,
   getCardDetails,
   getAll,
   getOne,
   remove
};