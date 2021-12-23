const Model = require("./model");
const commonModel = require("../common/common");
const {sendErroresponse, sendInternalErrorResponse, sendNoContentResponse, sendSuccessResponse } = require("../common/ResponseController");

const _isEmpty = require('lodash/isEmpty');
const _uniqBy = require('lodash/uniqBy');


const getAllCategories = async (request, response) => {
   try {
        const tempBody = {
            ...request.currentUser
        }
        const result = await commonModel.tryBlock(
            tempBody,
            "(Categories:getAllCategories)",
            Model.getAllCategories
        );
      if (result.error) {
        sendErroresponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
        sendSuccessResponse(response, result.data);
      } else {
        sendNoContentResponse(response);
      }
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const getShopCategoryItems = async (request, response) =>{
    try{
        const tempBody = {
            ...request.currentUser
        }
        const result = await commonModel.tryBlock(
            tempBody,
            "(Categories:getShopCategoryItems)",
            Model.getShopCategoryItems
        );
        if (result.error) {
            sendErroresponse(response, result.message);
        } else if (!_isEmpty(result.data)) {
            const groupNames = _uniqBy(result.data, 'groupName').map(item => item.groupName);
            const resultArr = groupNames.map(item => {
                const CategoryItems = result.data.filter(item2 => item2.groupName === item)
                    .map(item3 => { return { categoryItemId: item3.categoryItemId, categoryItemName:item3.categoryItemName } });
                return {groupName : item, CategoryItems};
            })
            sendSuccessResponse(response, resultArr);
        } else {
            sendNoContentResponse(response);
        }
    } catch (error) {
        sendInternalErrorResponse(response, { message: error.toString() });
    }
}

module.exports = {
   getAllCategories,
   getShopCategoryItems
}