const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const serviceModel = require("./model");
const commonModel = require("../common/common");
const { 
  sendErrorResponse, sendCreatedResponse, sendInternalErrorResponse, 
  sendNoContentResponse, sendSuccessResponse
} = require("../common/ResponseController");

const create = async (request,response)=>{
  try {
    const serviceId = uuidv4();
    const tempBody = { ...request.body,  serviceId: serviceId};
    const result = await commonModel.tryBlock(
      tempBody,
      "(Services:create)",
      serviceModel.create
    );
    if(result.error){
      sendErrorResponse(response, result.message);
    }else if (!_isEmpty(result.data)) {
      sendCreatedResponse(response, result.data);
   } else {
      sendInternalErrorResponse(response);
   }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
}

const update = async (request, response)=>{
  try {
    const tempBody = {...request.body, serviceId: request.params.id}
    const result = await commonModel.tryBlock(
      tempBody,
      "(Services:update)",
      serviceModel.update
    )
    if(result.error){
      sendErrorResponse(response, result.message)
    }else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data)
    } else {
      sendInternalErrorResponse(response)
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
}

const getOne = async (request, response) =>{
  try{
    const tempBody = {
      id: request.params.id
    }
    const result = await commonModel.tryBlock(
      tempBody,
      "(Services:getOne)",
      serviceModel.getOne
    );

    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data)
    } else {
      sendInternalErrorResponse(response)
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
}

const getAll = async(request,response) => {
  try {
    const result = await commonModel.tryBlock(
      request.body,
      "(Services:getAll)",
      serviceModel.getAll
    )
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      sendSuccessResponse(response, result.data)
    } else {
      sendInternalErrorResponse(response)
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
}

const remove = async(request,response)=>{
  try {
    const tempBody = {
      serviceId: request.params.id
    }
    const result = await commonModel.tryBlock(
      tempBody,
      "(Services:remove)",
      serviceModel.remove
    )
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!result.error) {
        sendSuccessResponse(response, result);
    } else {
        sendInternalErrorResponse(response);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
}

const relativeServices = async (request, response) => {
  try{
     const result = await commonModel.tryBlock (
        {subCategoryItemId: request.params.categoryId},
        "(Services:relativeProducts)",
        serviceModel.relativeProducts
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


module.exports = {
  create,
  update,
  getOne,
  getAll,
  remove,
  relativeServices
}