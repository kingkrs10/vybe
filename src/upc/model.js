const _isEmpty = require("lodash/isEmpty");

module.exports = {
  create: async (reqObj, client) => {
    try {
      const result = await client.query(
        `INSERT INTO "upcCodes"
         (
          "upcId",
          "upcCode",
          "upcName",
          "upcDescription",
          "upcHighPrice",
          "upcLowPrice",
          "upcImageURL",
          "upcCategory"
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING "upcId"`,
        [
          reqObj.upcId,
          reqObj.upcCode,
          reqObj.upcName,
          reqObj.upcDescription,
          reqObj.upcHighPrice,
          reqObj.upcLowPrice,
          reqObj.upcImageURL,
          reqObj.upcCategory,
        ]
      );
      return { error: false, message: "Data saved suceessfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  update: async (reqObj, client) => {
    try {
      const result = await client.query(
        `UPDATE "products" SET
            "upcName" = $1,
            "upcDescription" = $2,
            "upcPrice" = $3,
            "upcImageURL" = $4,
            "upcCategory" = $5,
            "updatedAt" = now()
            WHERE "upcId" = $6`,
        [
          reqObj.upcName,
          reqObj.upcDescription,
          reqObj.upcPrice,
          reqObj.upcImageURL,
          reqObj.upcCategory,
        ]
      );
      return { error: false, message: "Updated suceessfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getAll: async (reqObj, client) => {
    try {
      const limit = 250;
      const pageNo = reqObj.pageNo
        ? parseInt(reqObj.pageNo) === 1
          ? 0
          : (parseInt(reqObj.pageNo) - 1) * limit + 1
        : 1;
      var qryText = `SELECT
         "upcId", "upcCode","upcName", "upcDescription", "upcPrice",
         "upcImageURL", "upcCategory"
         FROM "upcCodes"
         WHERE "isActive" =$1`;
      var qryValues = [true];

      if (
        reqObj.sortValue &&
        reqObj.sortOrder &&
        !_isEmpty(reqObj.sortValue) &&
        !_isEmpty(reqObj.sortOrder)
      ) {
        qryText = `${qryText} ORDER BY ${reqObj.sortValue} ${reqObj.sortOrder}`;
      }

      const result = await client.query(qryText, qryValues);
      return { error: false, data: result.rows, message: "Read successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getOne: async (reqObj, client) => {
    try {
      const result = await client.query(
        `SELECT
        "upcId", "upcCode","upcName", "upcDescription", "upcHighPrice","upcLowPrice",
        "upcImageURL", "upcCategory"
         FROM "upcCodes"
         WHERE "upcCode" =$1`,
        [reqObj.upcCode]
      );
      return { error: false, data: result.rows, message: "Read successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  remove: async (reqObj, client) => {
    try {
      const result = await client.query(
        `UPDATE "products" SET
         "isActive" = $1
         WHERE "productId"=$2`,
        [false, reqObj.id]
      );
      if (result.rowCount > 0) {
        return { error: false, message: "Deleted successfully" };
      } else {
        return { error: true, message: "Deleted failed" };
      }
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },
};
