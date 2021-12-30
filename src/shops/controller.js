const shopsModel = require("./model");
const shopMembersModel = require("../shopMembers/model");
const shopCategoryItemsModel = require("../shopCategoryItems/model");
const commonModel = require("../common/common");

const {sendErroresponse, sendCreatedesponse, sendInternalErrorResponse, sendNoContentResponse, sendSuccessResponse } = require("../common/ResponseController");
const { v4: uuidv4 } = require("uuid");
const _isEmpty = require('lodash/isEmpty');

const create = async (request, response) => {
   try {
      const shopID = uuidv4();
      const tempBody = { ...request.body,  shopId: shopID};
      const result = await commonModel.tryBlock(
         tempBody,
         "(Shop:create)",
         shopsModel.create
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else {

         const result1 = await commonModel.tryBlock(
            {id: shopID},
            "(Shop:create : fetch getOne)",
            shopsModel.getOne
         );
         const data = [];
         const itemData = await constructedResponseData(result1.data[0], {id: shopID});
         data.push(itemData);

         sendCreatedesponse(response, data);
      }
   } catch (error) {
     sendInternalErrorResponse(response, { message: error.toString() });
   }
};

const update =  async (request, response) => {
   try {
      const tempBody = {...request.body, shopID: request.params.id};
      const result = await commonModel.tryBlock(
         tempBody,
         "(Shop:update)",
         shopsModel.update
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!result.error) {
          const result1 = await commonModel.tryBlock(
            {id: request.params.id},
            "(Shop:create : fetch getOne)",
            shopsModel.getOne
         );
         const data = [];
         const itemData = await constructedResponseData(result1.data[0], {id: request.params.id});
         data.push(itemData);
         sendSuccessResponse(response, data)
      } else {
         sendInternalErrorResponse(response)
      }
   } catch (error) {
      console.log(error);
      sendInternalErrorResponse(response, { message: error.toString() });
   }
};

const getAll = async (request, response) => {
   try {
      const tempBody = {
         ...request.currentUser
      }
      const result = await commonModel.tryBlock(
         tempBody,
         "(Shop:getAll)",
         shopsModel.getAll
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         const resultData = [];
         await Promise.all(result.data.map( async (item) =>{
            try {
               const dataObj = await constructedResponseData(item, {id: item.shopId});
               resultData.push(dataObj);
            } catch (error) {
               errorMsg = error.toString();
               success = false;
            }
         }));
         sendSuccessResponse(response, resultData);
      } else {
         sendNoContentResponse(response);
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
         "(Shop:getOne)",
         shopsModel.getOne
      );

      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
         const resultData = [];
         const itemObj = await constructedResponseData(result.data[0], tempBody);
         resultData.push(itemObj);
         sendSuccessResponse(response, resultData)
      } else {
         sendNoContentResponse(response);
      }
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const dashboard = async (request, response) =>{
   try{
      const tempBody = {...request.body, isNearby: true};
      const NearbyResult = await commonModel.tryBlock(
         tempBody,
         "(Shop:dashboard)",
         shopsModel.getAll
      );

      const result = await commonModel.tryBlock(
        {...request.body},
         "(Shop:dashboard)",
         shopsModel.getAll
      );

      if (result.error || NearbyResult.error) {
         sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data) || !_isEmpty(NearbyResult.data)) {
         const resultData = [];
         resultData.push({shopCategory: 'Nearby', shopList: NearbyResult.data.slice(0, 4)});
         const groupname = [...new Set(result.data.map(item => item.groupName))];

         await Promise.all(groupname.map( async (item) =>{
            const tempData = result.data.filter(data => data.groupName === item).slice(0, 4);
            resultData.push({shopCategory: item, shopList: tempData});
         }));
         sendSuccessResponse(response, resultData)
      } else {
         sendNoContentResponse(response);
      }
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const remove = async (request, response) =>{
   try{
      const tempBody = {
         id: request.params.id
      }
      const result = await commonModel.tryBlock(
         tempBody,
         "(Shop:remove)",
         shopsModel.remove
      );
      if (result.error) {
         sendErroresponse(response, result.message);
      } else if (!result.error) {
         sendSuccessResponse(response, result);
      } else {
         sendInternalErrorResponse(response);
      }
   } catch (error) {
   sendInternalErrorResponse (response, {message: error.toString()});
   }
}


const constructedResponseData = async (resultObj, obj) => {
   const shopMembers = await commonModel.tryBlock(
      obj,
      "(Shop:getOne: get shopMembers)",
      shopMembersModel.getOne
   );
   const shopCategoryItems = await commonModel.tryBlock(
      obj,
      "(Shop:getOne: get shopCategoryItems)",
      shopCategoryItemsModel.getOne
   );
   var data = !_isEmpty(resultObj) ? resultObj : {};

   if(!_isEmpty(data)){
      data['shopMembers'] = !shopMembers.error ? shopMembers.data : [];
      data['shopCategoryItems'] = !shopCategoryItems.error ? shopCategoryItems.data: [];
   }
   return data;
}

module.exports = {
   create,
   update,
   getAll,
   getOne,
   remove,
   dashboard
}