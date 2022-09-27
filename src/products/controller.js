const { v4: uuidv4 } = require("uuid");
const _isEmpty = require("lodash/isEmpty");

const productsModel = require("./model");
const upcModel = require("../upc/model");
const shopModel = require("../shops/model");
const CollectionsModel = require("../shopCollections/model");
const commonModel = require("../common/common");
const axios = require("axios");
const {
  sendErrorResponse,
  sendCreatedResponse,
  sendInternalErrorResponse,
  sendNoContentResponse,
  sendSuccessResponse,
} = require("../common/ResponseController");

const create = async (request, response) => {
  let result;
  //   let newProduct;
  try {
    const productId = uuidv4();
    const tempBody = { ...request.body, productId: productId };

    //  console.log(request.body);

    const upc = await commonModel.tryBlock(
      { upcCode: request.body.productUPC },
      "(UPC:getOne)",
      upcModel.getOne
    );

    const shop = await commonModel.tryBlock(
      { id: request.body.userId },
      "(Shops:getOne)",
      shopModel.getOne
    );

    //  console.log(shop);

    // If upc is not empty
    if (_isEmpty(upc.data)) {
      // If upc is empty
      const response = await axios.get(
        `https://api.upcitemdb.com/prod/trial/lookup?upc=${request.body.productUPC}`
      );
      const newUPC = response.data.items[0];

      const upcId = uuidv4();
      const upcBody = {
        upcId: upcId,
        upcCode: request.body.productUPC,
        upcName: newUPC.title,
        upcDescription: newUPC.description,
        upcHighPrice: newUPC.highest_recorded_price,
        upcLowPrice: newUPC.lowest_recorded_price,
        upcImageURL: newUPC.images[0],
        upcCategory: newUPC.category,
      };

      const upcCreate = await commonModel.tryBlock(
        upcBody,
        "(UPC:create)",
        upcModel.create
      );

      const newProduct = {
        productId: productId,
        productUPC: request.body.productUPC,
        productShopId: shop.data[0].shopId,
        productName: newUPC.title,
        productDescription: newUPC.description,
        productPrice: newUPC.lowest_recorded_price,
        productImageURL: newUPC.images[0],
        productCategoryItemId: newUPC.category,
      };

      // console.log(upcCreate);
      // console.log("new product after upc");

      result = await commonModel.tryBlock(
        newProduct,
        "(Products:create)",
        productsModel.create
      );
    } else {
      const newUPC = upc.data[0];
      const newProduct = {
        productId: productId,
        productUPC: newUPC.upcCode,
        productShopId: shop.data[0].shopId,
        productName: newUPC.upcName,
        productDescription: newUPC.upcDescription,
        productPrice: newUPC.upcHighPrice,
        productImageURL: newUPC.upcImageURL[0],
        productCategoryItemId: newUPC.upcCategory,
      };

      result = await commonModel.tryBlock(
        newProduct,
        "(Products:create)",
        productsModel.create
      );
    }

    if (result.error) {
      sendErrorResponse(response, result.message);
    } else {
      const result1 = await commonModel.tryBlock(
        { id: productId },
        "(Products:getOne)",
        productsModel.getOne
      );
      sendCreatedResponse(response, result1.data);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const update = async (request, response) => {
  try {
    const tempBody = { ...request.body, productId: request.params.id };
    const result = await commonModel.tryBlock(
      tempBody,
      "(Products:update)",
      productsModel.update
    );
    if (result.error) {
      sendErrorResponse(response, result.message);
    } else {
      const result1 = await commonModel.tryBlock(
        { id: request.params.id },
        "(Products:getOne)",
        productsModel.getOne
      );
      sendSuccessResponse(response, result1.data);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const getAll = async (request, response) => {
  try {
    const tempBody = { ...request.query, ...request.currentUser };
    const result = await commonModel.tryBlock(
      tempBody,
      "(Products:getAll)",
      productsModel.getAll
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
};

const getOne = async (request, response) => {
  try {
    const tempBody = { id: request.params.id };
    const result = await commonModel.tryBlock(
      tempBody,
      "(Products:getOne)",
      productsModel.getOne
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
};

const getShopProducts = async (request, response) => {
  //   console.log(request);
  try {
    const result = await commonModel.tryBlock(
      { shopId: request.params.shopId },
      "(Products:getAll)",
      productsModel.getAll
    );

    //  console.log(result);

    if (result.error) {
      sendErrorResponse(response, result.message);
    } else if (!_isEmpty(result.data)) {
      // const colectionResult = await commonModel.tryBlock(
      //   { shopId: request.params.shopId },
      //   "(Products:getAll)",
      //   CollectionsModel.getAll
      // );
      // var resultData = [];

      // if (!colectionResult.error) {
      //   colectionResult.data.map((item) => {
      //     const tempArr = result.data
      //       .filter((i) => i.shopCollectionId === item.shopCollectionId)
      //       .slice(0, 4);
      //     resultData.push({
      //       collectionName: item.collectionName,
      //       shopCollectionId: item.shopCollectionId,
      //       products: tempArr,
      //     });
      //   });
      // } else {
      //   resultData = [...result.data];
      // }
      // console.log(result.data);
      sendSuccessResponse(response, result.data);
    } else {
      sendNoContentResponse(response);
    }
  } catch (error) {
    sendInternalErrorResponse(response, { message: error.toString() });
  }
};

const getShopCollectionProducts = async (request, response) => {
  try {
    const tempBody = {
      shopId: request.params.shopId,
      collectionId: request.params.collectionId,
      ...request.query,
    };

    const result = await commonModel.tryBlock(
      tempBody,
      "(Products:getShopCollectionProducts)",
      productsModel.getAll
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
};

const remove = async (request, response) => {
  try {
    const tempBody = { ...request.body, id: request.params.id };
    const result = await commonModel.tryBlock(
      tempBody,
      "(Products:remove)",
      productsModel.remove
    );
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
};

const productAvailabilty = async (request, response) => {
  try {
    const tempBody = { ...request.body };
    const result = await commonModel.tryBlock(
      tempBody,
      "(Products:productAvailabilty)",
      productsModel.productAvailabilty
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
};

const relativeProducts = async (request, response) => {
  try {
    const tempBody = { ...request.body };
    const result = await commonModel.tryBlock(
      { categoryItemId: request.params.categoryItemId },
      "(Products:relativeProducts)",
      productsModel.relativeProducts
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
};

const homepageProducts = async (request, response) => {
  try {
    const tempBody = {
      ...request.currentUser,
      ...request.query,
      pageNo: request.query.pageNo || 1,
    };
    const result = await commonModel.tryBlock(
      tempBody,
      "(Products:homepageProducts)",
      productsModel.homepageProducts
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
};

module.exports = {
  create,
  update,
  getAll,
  getOne,
  remove,
  getShopProducts,
  productAvailabilty,
  relativeProducts,
  getShopCollectionProducts,
  homepageProducts,
};
