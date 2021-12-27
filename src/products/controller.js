const productsModel = require("./model");
const commonModel = require("../common/common");
const {sendErroresponse, sendCreatedesponse, sendInternalErrorResponse, sendNoContentResponse, sendSuccessResponse } = require("../common/ResponseController");
const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

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
         sendErroresponse(response,result.message);
      } else {
         const result1 = await commonModel.tryBlock (
            {id: productId},
            "(Products:getOne)",
            productsModel.getOne
         )
         sendCreatedesponse(response, result1.data);
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
         sendErroresponse(response,result.message);
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
      const tempBody = {...request.currentUser}
      const result = await commonModel.tryBlock (
         tempBody,
         "(Products:getAll)",
         productsModel.getAll
      )
      console.log(result);
      if(result.error){
         sendErroresponse(response,result.message);
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
         sendErroresponse(response,result.message);
      } else if (!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data);
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
         sendErroresponse(response, result.message);
      } else if (!result.error) {
         sendSuccessResponse(response, result);
      } else {
         sendInternalErrorResponse(response);
      }
   } catch (error){
       sendInternalErrorResponse(response, { message: err.toString()});
   }
};

module.exports = {
   create,
   update,
   getAll,
   getOne,
   remove
}