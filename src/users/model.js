const _isEmpty = require("lodash/isEmpty");

module.exports = {
  create: async (reqObj, client) => {
    // console.log(`Request data: ${JSON.stringify(reqObj)}`);
    try {
      const result = await client.query(
        `INSERT INTO users (
            "userId",
            balance,
            "notificationUnReadcount",
            "firstName",
            "lastName",
            "emailAddress",
            "phoneNumber",
            "stripeCustomerId",
            "currencyCode",
            "currencySymbol",
            "firebaseUId"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
        [
          reqObj.uid,
          reqObj.balance,
          0,
          reqObj.firstName,
          reqObj.lastName,
          reqObj.emailAddress,
          reqObj.phoneNumber,
          reqObj.stripeCustomerId,
          reqObj.currencyCode,
          reqObj.currencySymbol,
          reqObj.firebaseUId,
        ]
      );
      let resultData = result.rowCount ? result.rows[0] : {};
      // console.log(JSON.stringify(resultData));
      // console.log(JSON.stringify(result.data));
      return {
        error: false,
        data: resultData,
        message: "Data saved successfully",
      };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getAll: async (reqObj, client) => {
    try {
      const limit = 50;
      const pageNo = reqObj.pageNo
        ? parseInt(reqObj.pageNo) === 1
          ? 0
          : (parseInt(reqObj.pageNo) - 1) * limit + 1
        : 0;

      var queryText = `SELECT
			"userId", balance, "notificationUnReadcount", "deviceId", "firstName", "lastName", "emailAddress", "stripeCustomerId", latitude, longitude,
			"currencyCode",	"currencySymbol", profession, "isActive", "createdAt", "phoneNumber", "firebaseUId" as uid, "userImage", "userThumpImage", "userMediumImage",
			( 3959 * acos( cos( radians($4) ) * cos( radians( U.latitude ) ) * cos( radians( U.longitude ) - radians($5) ) + sin( radians($4) ) * sin( radians( U.latitude ) ) ) ) AS distance
			FROM users U
			WHERE "isActive" = $1`;
      var qryValue = [true, limit, pageNo, reqObj.latitude, reqObj.longitude];

      if (reqObj.recentUsers) {
        queryText = `${queryText} AND ("createdAt" > current_date - interval '7 days')`;
      }

      if (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm)) {
        queryText = `${queryText} AND (LOWER("fullName") like LOWER($6) OR LOWER("profession") like LOWER($6))`;
        qryValue = [
          true,
          limit,
          pageNo,
          reqObj.latitude,
          reqObj.longitude,
          `%${reqObj.searchTerm}%`,
        ];
      }

      const result = await client.query(
        `${queryText} ORDER BY U."userId" offset $3 limit $2 `,
        qryValue
      );
      const data = result.rows || [];
      return { error: false, data, message: "get all data successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getOne: async (obj, client) => {
    try {
      const whereCondition = obj.uid
        ? `WHERE "userId" =$1`
        : obj.id
        ? `WHERE "firebaseUId" = $1`
        : `WHERE "emailAddress" = $1`;
      const val = obj.uid ? obj.uid : obj.id ? obj.id : obj.emailAddress;
      const result = await client.query(
        `SELECT
        "userId",
        balance,
        "notificationUnReadcount",
        "deviceId",
        "firstName",
        "lastName",
        "emailAddress",
        "stripeCustomerId",
        "currencyCode",
        "currencySymbol",
        "phoneNumber"
			FROM users
			${whereCondition} AND "isActive" = $2`,
        [val, true]
      );
      const data = result.rows[0] || {};
      return { error: false, data, message: "Get data successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  remove: async (id, client) => {
    try {
      const result = await client.query(
        `UPDATE users SET "isActive" = $1  WHERE "userId" = $2`,
        [false, id]
      );
      return {
        error: false,
        removedUserId: id,
        message: "user removed successfully",
      };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  update: async (Obj, client) => {
    try {
      const { reqObj, userId } = Obj;
      const result = await client.query(
        `UPDATE users SET 
          "firstName" = $2,
          "lastName" = $3,
          "dateOfBirth" = $4,
          "gender" = $5,
          "city" = $6,
          "education" = $7,
          "employer" = $8,
          "monthlyRent" = $9,
          "monthlyIncome" = $10,
          "creditScore" = $11,
          "idMatch" = $12,
          "familyStatus" = $13,
          "hasCar" = $14,
          "level" = $15,
          "updatedAt" = now()
        WHERE "userId" = $1 RETURNING *`,
        [
          userId,
          reqObj.firstName,
          reqObj.lastName,
          reqObj.dateOfBirth,
          reqObj.gender,
          reqObj.city,
          reqObj.education,
          reqObj.employer,
          reqObj.monthlyRent,
          reqObj.monthlyIncome,
          reqObj.creditScore,
          reqObj.idMatch,
          reqObj.familyStatus,
          reqObj.hasCar,
          reqObj.level,
        ]
      );

      let data = result.rowCount > 0 ? result.rows[0] : null;
      // console.log(JSON.stringify(data));

      return { error: false, data: data, message: "Data saved successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  updateLocation: async (Obj, client) => {
    try {
      const { reqObj, uid } = Obj;
      const result = await client.query(
        `UPDATE users SET latitude = $2, "longitude" = $3
				WHERE "userId" = $1  RETURNING *`,
        [uid, reqObj.latitude, reqObj.longitude]
      );

      let data = result.rowCount ? result.rows[0] : null;
      return { error: false, data: data, message: "Data saved successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  updateBlockedUsers: async (Obj, client) => {
    try {
      const { reqObj, uid } = Obj;
      const result = client.query(
        `INSERT INTO "users_blockedUsers" ("userId", "blockedUserId")
			VALUES ($1, $2)`,
        [uid, reqObj.blockedUserId]
      );

      return { error: false, message: "Data update successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  updateStripeId: async (reqObj, client) => {
    console.log(reqObj);
    try {
      const result = await client.query(
        `UPDATE users SET
				"stripeCustomerId" = $2,
        "updatedAt" = now()
				WHERE "userId" = $1 RETURNING *`,
        [reqObj.uid, reqObj.stripeCustomerId]
      );

      let data = result.rowCount > 0 ? result.rows[0] : null;
      // console.log(data);
      return {
        error: false,
        data: data,
        message: "Data update successfully",
      };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getBlockedUsers: async (obj, client) => {
    try {
      const result = await client.query(
        `
			SELECT "blockedUserId", U."firebaseUId"
			FROM "users_blockedUsers" BU
			INNER JOIN users U ON U."userId" = BU."blockedUserId" where BU."userId" = $1`,
        [obj.id]
      );

      const data = result.rowCount
        ? result.rows.map((item) => item.firebaseUId)
        : [];
      return { error: false, data: data, message: "Data fetched successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  updateBalance: async (reqObj, client) => {
    try {
      const result = await client.query(
        `UPDATE users SET
				balance = $2, "currencyCode"= $3, "currencySymbol"= $4
				WHERE "userId" = $1`,
        [reqObj.uid, reqObj.balance, reqObj.currencyCode, reqObj.currencySymbol]
      );

      return { error: false, message: "Data update successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  updateMobileNumber: async (obj, client) => {
    try {
      const { reqObj, uid } = obj;
      const result = await client.query(
        `UPDATE users SET "phoneNumber" = $2
				WHERE "firebaseUId" = $1 RETURNING *`,
        [uid, reqObj.phoneNumber]
      );
      return {
        error: false,
        data: result.rows || [],
        message: "Data update successfully",
      };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },
};
