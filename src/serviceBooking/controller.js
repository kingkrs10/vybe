const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const commonModel = require("../common/common");
const serviceBookingModel = require('./model')

const { 
  sendErrorResponse, sendCreatedResponse, sendInternalErrorResponse, 
  sendNoContentResponse, sendSuccessResponse
} = require("../common/ResponseController");


const create = async (request,response)=>{
  try {
    const tempBody = { ...request.body, serviceBookingId: uuidv4()};
    const result = await commonModel.tryBlock(
      tempBody,
      "(ServiceBooking:create)",
      serviceBookingModel.create
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
    const tempBody = {...request.body, serviceBookingId: request.params.id}
    const result = await commonModel.tryBlock(
      tempBody,
      "(ServiceBooking:update)",
      serviceBookingModel.update
    )
   
    if(result.error){
      sendErrorResponse(response, result.message)
    }else if (!_isEmpty(result)) {
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
      "(ServiceBooking:getOne)",
      serviceBookingModel.getOne
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
      "(ServiceBooking:getAll)",
      serviceBookingModel.getAll
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


module.exports={
  create,
  update,
  getOne,
  getAll
}