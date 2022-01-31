const serviceModel = require("./model");
const commonModel = require("../common/common");
const {
   sendErrorResponse, sendCreatedResponse, sendInternalErrorResponse,
} = require("../common/ResponseController");

const create = async (request, response) => {
   try{
      const tempBody = {...request.body};
      const { create, remove} = serviceModel;
      const modelFunc = request.body.isFollwers ? create : remove;
      const result = await commonModel.tryBlock (
         tempBody,
         "(serviceFollowers:create)",
         modelFunc
      )

      if(result.error){
         sendErrorResponse(response,result.message);
      } else {        
         sendCreatedResponse(response);
      }
   } catch (error){
      sendInternalErrorResponse(response, { message: err.toString()});
   }
};

module.exports = {
   create
}