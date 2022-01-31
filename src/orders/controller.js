const _isEmpty = require('lodash/isEmpty');
const { v4: uuidv4 } = require("uuid");

const ordersModel = require('./model');
const commonModel = require("../common/common");
const {
   sendErrorResponse, sendCreatedResponse,
   sendInternalErrorResponse, sendNoContentResponse,
   sendSuccessResponse
} = require("../common/ResponseController");

const create = async (request, response) => {
   try{
      const orderId = uuidv4();
      const tempBody = {...request.body, orderId: orderId}
      const result = await commonModel.tryBlock(
         tempBody,
         "(Orders:create)",
         ordersModel.create
      )

      if(result.error){
         sendErrorResponse(response, result.message);
      } else {
         const result1 = await commonModel.tryBlock(
            {orderId:orderId, userId: request.body.userId},
            "(Orders:create : getOne)",
            ordersModel.getOne
         )
         sendCreatedResponse(response, result1.data);
      }
   } catch (error){
      sendInternalErrorResponse(response, {message: error.toString()});
   }
};

const getAll = async (request, response) => {
   try{
      const tempBody = {...request.currentUser, shopId: request.params.shopId }
      const result = await commonModel.tryBlock(
         tempBody,
         "(Orders: getAll)",
         ordersModel.getAll
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
      const tempBody = {shopId: request.params.shopId, orderId: request.params.orderId}
      const result = await commonModel.tryBlock(
         tempBody,
         "(Orders:getOne)",
         ordersModel.getOne
      );

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

const updateStatus = async (request, response) => {
   try{
      const tempBody = {id: request.params.id, Obj: request.body}
      const result = await commonModel.tryBlock(
         tempBody,
         "(Orders:updateStatus)",
         ordersModel.updateStatus
      );

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

module.exports ={
   create,
   getOne,
   getAll,
   updateStatus
}