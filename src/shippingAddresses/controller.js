const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const shippingAddressesModel = require("./model");
const commonModel = require("../common/common");
const {
   sendErroresponse, sendCreatedesponse, sendInternalErrorResponse,
   sendNoContentResponse, sendSuccessResponse
} = require("../common/ResponseController");

const create = async (request, response) => {
   try{
      const addressId = uuidv4();
      const tempBody = {...request.body, addressId: addressId}
      const result = await commonModel.tryBlock (
         tempBody,
         "(shippingAddresses:create)",
         shippingAddressesModel.create
      )

      if(result.error){
         sendErroresponse(response,result.message);
      } else {
         const result1 = await commonModel.tryBlock (
            {addressId: addressId},
            "(shippingAddresses:getOne)",
            shippingAddressesModel.getOne
         )
         sendCreatedesponse(response, result1.data);
      }
   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const update = async (request, response) => {
   try{
      const tempBody = {...request.body, addressId: request.params.addressId}
      const result = await commonModel.tryBlock (
         tempBody,
         "(shippingAddresses:update)",
         shippingAddressesModel.update
      )
      if(result.error){
         sendErroresponse(response,result.message);
      } else {
         const result1 = await commonModel.tryBlock (
            {addressId: request.params.addressId},
            "(shippingAddresses:getOne)",
            shippingAddressesModel.getOne
         )
         sendSuccessResponse(response, result1.data);
      }
   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

const getAll = async(request, response) => {
   const tempBody = {...request.currentUser}
   try{
      const result = await commonModel.tryBlock(
         tempBody,
         "(shippingAddresses:getAll)",
         shippingAddressesModel.getAll
      )
      if(result.error){
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data)
      } else{
         sendNoContentResponse(response)
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
};

const getOne = async(request, response) => {
   const tempBody = {addressId : request.params.addressId}
   try{
      const result = await commonModel.tryBlock(
         tempBody,
         "(shippingAddresses:getOne)",
         shippingAddressesModel.getOne
      )
      if(result.error){
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data)
      } else{
         sendNoContentResponse(response)
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
};

const remove = async(request, response) => {
   const tempBody = {addressId : request.params.addressId}
   try{
      const result = await commonModel.tryBlock(
         tempBody,
         "(shippingAddresses:remove)",
         shippingAddressesModel.remove
      )
      if(result.error){
         sendErroresponse(response, result.message);
      } else if(!_isEmpty(result.data)){
         sendSuccessResponse(response, result.data)
      } else{
         sendNoContentResponse(response)
      }
   } catch(error){
      sendInternalErrorResponse(response, {message: error.toString()})
   }
};

module.exports = {
   create,
   update,
   getAll,
   getOne,
   remove
}
