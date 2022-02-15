const shopMembersModel = require("../shopMembers/model");
const shopCategoryItems = require("../shopCategoryItems/model");
module.exports = {
  create: async (reqObj, client) => {
    try {
      const result = await client.query(
        `INSERT INTO shops(
               "shopId",
               "shopName",
               "userId",
               "shopDescription",
               "shopShortDescription",
               "locationName",
               "latitude",
               "longitude",
               "shopImageURL",
               "shopThumpImageURL",
               "shopMediumImageURL",
               "socialMedia",
               "shipping_processing_time",
               "shipping_customs_and_import_taxes"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING "shopId"`,
        [
          reqObj.shopId,
          reqObj.shopName,
          reqObj.userId,
          reqObj.shopDescription,
          reqObj.shopShortDescription,
          reqObj.locationName,
          reqObj.latitude,
          reqObj.longitude,
          reqObj.shopImageURL,
          reqObj.shopThumpImageURL,
          reqObj.shopMediumImageURL,
          reqObj.socialMedia,
          reqObj.shipping_processing_time,
          reqObj.shipping_customs_and_import_taxes
        ]
      );
      let success = true;
      let errorMsg = null;

      if (result.rowCount > 0) {
        await Promise.all(
          reqObj.shopMembers.map(async item => {
            try {
              await shopMembersModel.create(
                { ...item, shopId: reqObj.shopId },
                client
              );
            } catch (error) {
              errorMsg = error.toString();
              success = false;
            }
          })
        );

        await Promise.all(
          reqObj.shopCategoryItems.map(async item => {
            try {
              await shopCategoryItems.create(
                { ...item, shopId: reqObj.shopId },
                client
              );
            } catch (error) {
              errorMsg = error.toString();
              success = false;
            }
          })
        );
      } else {
        errorMsg = "Data saved failed";
        success = false;
      }

      if (success && !errorMsg) {
        return { error: false, message: "Data saved successfully" };
      } else {
        return { error: true, message: "Data saved failed" };
      }
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  update: async (reqObj, client) => {
    try {
      const result = await client.query(
        `UPDATE shops SET
            "shopName" = $1,
            "userId" = $2,
            "shopDescription" = $3,
            "shopShortDescription" = $4,
            "locationName" = $5,
            "latitude" = $6,
            "longitude" = $7,
            "shopImageURL" = $8,
            "shopThumpImageURL" = $9,
            "shopMediumImageURL" = $10,
            "socialMedia" = $11,
            "shipping_processing_time" = $12,
            "shipping_customs_and_import_taxes" = $13,
            "updatedAt" = now()
            WHERE "shopId" = $14
            RETURNING "shopId"
         `,
        [
          reqObj.shopName,
          reqObj.userId,
          reqObj.shopDescription,
          reqObj.shopShortDescription,
          reqObj.locationName,
          reqObj.latitude,
          reqObj.longitude,
          reqObj.shopImageURL,
          reqObj.shopThumpImageURL,
          reqObj.shopMediumImageURL,
          reqObj.socialMedia,
          reqObj.shipping_processing_time,
          reqObj.shipping_customs_and_import_taxes,
          reqObj.shopID
        ]
      );
      let success = true;
      let errorMsg = null;
      if (result.rowCount > 0) {
        await shopMembersModel.remove({ shopId: reqObj.shopID }, client);

        await Promise.all(
          reqObj.shopMembers.map(async item => {
            try {
              await shopMembersModel.create(
                { ...item, shopId: reqObj.shopID },
                client
              );
            } catch (error) {
              errorMsg = error.toString();
              success = false;
            }
          })
        );

        await shopCategoryItems.remove({ shopId: reqObj.shopID }, client);

        await Promise.all(
          reqObj.shopCategoryItems.map(async item => {
            try {
              await shopCategoryItems.create(
                { ...item, shopId: reqObj.shopID },
                client
              );
            } catch (error) {
              errorMsg = error.toString();
              success = false;
            }
          })
        );
      } else {
        errorMsg = "Data saved failed error";
        success = false;
      }

      if (success && !errorMsg) {
        return { error: false, message: "Data saved successfully" };
      } else {
        return { error: true, message: "Data saved failed 23" };
      }
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getOne: async (reqObj, client) => {
    try {
      const result = await client.query(
        `SELECT
         "shopId","shopName",S."userId","shopDescription","shopShortDescription","locationName",
         S."latitude",S."longitude",S."shopImageURL",S."shopThumpImageURL",S."shopMediumImageURL",
         S."socialMedia",S."shipping_processing_time",S."shipping_customs_and_import_taxes",
         S."isActive",S."createdAt",S."updatedAt" , U."userImage", U."userThumpImage", U."userMediumImage"
         FROM shops S
         INNER JOIN users AS U ON U."userId" = S."userId"
         WHERE S."shopId" = $1
         `,
        [reqObj.id]
      );
      return { error: false, data: result.rows };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getShopCategory: async (reqObj, client) => {
    try {
      var result = await client.query(
        `SELECT DISTINCT CA."categoryId", CA."categoryName" FROM categories CA 
          INNER JOIN "shop_categoryItems" AS SCI ON SCI."categoryItemId" = CA."categoryId"
          INNER JOIN shops AS S ON S."shopId" = SCI."shopId"
         WHERE CA."isActive" = $1 
         AND S."isActive" = $1`,
        [true]
      );
      return { error: false, data: result.rows };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getAll: async (reqObj, client) => {
    const limit = reqObj.limit ? reqObj.limit : 50;
    try {
      var queryText = `SELECT * FROM (SELECT
            S."shopId", "shopName", S."userId", "shopDescription", "shopShortDescription", "locationName",
            S."latitude", S."longitude", "shopImageURL", "shopThumpImageURL", "shopMediumImageURL",
            U."userImage", U."userThumpImage", U."userMediumImage",
            C."categoryId", C."categoryName", S."isActive",
            ( 3959 * acos( cos( radians($2) ) * cos( radians( S.latitude ) ) * cos( radians( S.longitude ) - radians($3) ) + sin( radians($2) ) * sin( radians( S.latitude) ) ) ) AS distance
            FROM shops AS S
            INNER JOIN users AS U ON U."userId" = S."userId"
            INNER JOIN "shop_categoryItems" AS SCI ON SCI."shopId" = S."shopId"
			INNER JOIN  categories C ON C."categoryId" = SCI."categoryItemId") AS tbl
         WHERE "isActive" = $1
         `;
      var qryValue = [true, reqObj.latitude, reqObj.longitude, limit];

      if (reqObj.isNearby) {
        queryText += ` AND distance < $5`;
        qryValue = [true, reqObj.latitude, reqObj.longitude, limit, 100];
      }

      if (reqObj.categoryId) {
        queryText += ` AND "categoryId" = $5`;
        qryValue = [
          true,
          reqObj.latitude,
          reqObj.longitude,
          limit,
          reqObj.categoryId
        ];
      }

      const result = await client.query(`${queryText} limit $4`, qryValue);
      return { error: false, data: result.rows, message: "Read successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  remove: async (reqObj, client) => {
    try {
      const result = await client.query(
        `UPDATE shops SET "isActive" = $1 WHERE "shopId"= $2`,
        [false, reqObj.id]
      );
      if (result.rowCount > 0) {
        await shopMembersModel.updateInactive({ shopId: reqObj.id }, client);
        await shopCategoryItems.updateInactive({ shopId: reqObj.id }, client);

        return { error: false, message: "Deleted successfully" };
      } else {
        return { error: true, message: "Deleted failed" };
      }
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  }
};
