const _isEmpty = require('lodash/isEmpty');
const { v4: uuidv4 } = require("uuid");

const productReviewModel = require('./model');
const commonModel = require("../common/common");
const {
   sendErrorResponse, sendCreatedResponse,
   sendInternalErrorResponse, sendNoContentResponse,
   sendSuccessResponse
} = require("../common/ResponseController");

const create = async (request, response) => {
   try{
      const productReviewId = uuidv4();
      const tempBody = {...request.body, productReviewId: productReviewId}
      const result = await commonModel.tryBlock(
         tempBody,
         "(productReview:create)",
         productReviewModel.create
      )

      if(result.error){
         sendErrorResponse(response, result.message);
      } else {
         const result1 = await commonModel.tryBlock(
            { productId: request.body.productId , productReviewId : productReviewId },
            "(productReview:create : getOne)",
            productReviewModel.getOne
         )
         sendCreatedResponse(response, result1.data);
      }
   } catch (error){
      sendInternalErrorResponse(response, {message: error.toString()});
   }
};

const update =  async (request, response) => {
   try {
      const tempBody = {...request.body, productReviewId: request.params.id};
      const result = await commonModel.tryBlock(
         tempBody,
         "(productReview:update)",
         productReviewModel.update
      );
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!result.error) {
          const result1 = await commonModel.tryBlock(
            { productId: request.body.productId , productReviewId: request.params.id },
            "(productReview:update : fetch getOne)",
            productReviewModel.getOne
         );
         sendSuccessResponse(response, result1.data)
      } else {
         sendInternalErrorResponse(response)
      }
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
};

const getAll = async (request, response) => {
   try{
      const tempBody = {productId: request.params.productId}
      const result = await commonModel.tryBlock (
         tempBody,
         "(productReview:getAll)",
         productReviewModel.getAll
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
      const tempBody = { productId: request.params.productId, productReviewId:request.params.productReviewId }
      const result = await commonModel.tryBlock (
         tempBody,
         "(productReview:getOne)",
         productReviewModel.getOne
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

const remove = async (request, response) =>{
   try{
      const tempBody = {
         id: request.params.id
      }
      const result = await commonModel.tryBlock(
         tempBody,
         "(productReview:remove)",
         productReviewModel.remove
      );
      if (result.error) {
         sendErrorResponse(response, result.message);
      } else if (!result.error) {
         sendSuccessResponse(response);
      } else {
         sendInternalErrorResponse(response);
      }
   } catch (error) {
   sendInternalErrorResponse (response, {message: error.toString()});
   }
}

module.exports ={
   create,
   update,
   getAll,
   getOne,
   remove
}