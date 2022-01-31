const _isEmpty = require('lodash/isEmpty');
const _uniqBy = require('lodash/uniqBy');

const Model = require("./model");
const commonModel = require("../common/common");
const {sendErrorResponse, sendInternalErrorResponse, sendNoContentResponse, sendSuccessResponse } = require("../common/ResponseController");

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
        sendErrorResponse(response, result.message);
      } else if (!_isEmpty(result.data)) {
        sendSuccessResponse(response, result.data);
      } else {
        sendNoContentResponse(response);
      }
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const getCategoryItems = async (request, response) =>{
    try{
        const tempBody = {
            ...request.currentUser,
            keyCode: request.params.keyCode
        }
        const result = await commonModel.tryBlock(
            tempBody,
            "(Categories:getCategoryItems)",
            Model.getCategoryItems
        );
        if (result.error) {
            sendErrorResponse(response, result.message);
        } else if (!_isEmpty(result.data)) {
            sendSuccessResponse(response, result.data);
        } else {
            sendNoContentResponse(response);
        }
    } catch (error) {
        sendInternalErrorResponse(response, { message: error.toString() });
    }
}

const getSubCategoryItems = async (request, response) =>{
    try{
        const tempBody = {
            ...request.currentUser,
           ...request.body
        }
        const result = await commonModel.tryBlock(
            tempBody,
            "(Categories:getSubCategoryItems)",
            Model.getSubCategoryItems
        );
        if (result.error) {
            sendErrorResponse(response, result.message);
        } else if (!_isEmpty(result.data)) {
            const categoryNames = _uniqBy(result.data, 'categoryName').map(item => item.categoryName);
            const resultArr = categoryNames.map(item => {
                const CategoryItems = result.data.filter(item2 => item2.categoryName === item)
                    .map(item3 => { return { categoryItemId: item3.categoryItemId, categoryItemName:item3.categoryItemName } });
                return {categoryName : item, CategoryItems};
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
   getCategoryItems,
   getSubCategoryItems
}