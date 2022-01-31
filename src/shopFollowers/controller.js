const shopFollowersModel = require("./model");
const commonModel = require("../common/common");
const {
   sendErrorResponse, sendCreatedResponse, sendInternalErrorResponse,
} = require("../common/ResponseController");

const create = async (request, response) => {
   try{
      const tempBody = {...request.body}
      const modelFunc = request.body.isFollwers ? shopFollowersModel.create : shopFollowersModel.remove
      const result = await commonModel.tryBlock (
         tempBody,
         "(shopFollowers:create)",
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
