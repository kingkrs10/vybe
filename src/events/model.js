const _isEmpty = require("lodash/isEmpty");

module.exports = {
  create: async (reqObj, client) => {
    // console.log("reqObj", reqObj);
    try {
      const result = await client.query(
        `INSERT INTO events
				(
          "eventId", 
          "userId", 
          "name",
          "description",
          "category",
          "type",
          "address",
          "country",
          "city",
          "state",
          "postalCode",
          "virtualUrl",
          "password",
          "timezone",
          "startDate",
          "startTime",
          "endDate",
          "endTime",
          "endVisible",
          "image",
          "website",
          "twitter",
          "facebook",
          "instagram",
          "lat",
          "lng"
        ) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26) RETURNING *`,
        [
          reqObj.eventId,
          reqObj.userId,
          reqObj.name,
          reqObj.description,
          reqObj.category,
          reqObj.type,
          reqObj.address,
          reqObj.country,
          reqObj.city,
          reqObj.state,
          reqObj.postalCode,
          reqObj.virtualUrl,
          reqObj.password,
          reqObj.timezone,
          reqObj.startDate,
          reqObj.startTime,
          reqObj.endDate,
          reqObj.endTime,
          reqObj.endVisible,
          reqObj.image,
          reqObj.website,
          reqObj.twitter,
          reqObj.facebook,
          reqObj.instagram,
          reqObj.lat,
          reqObj.lng,
        ]
      );
      // .then((res) => console.log(res.rows[0]))
      // .catch((e) => console.error(e.stack));

      let data = result.rowCount > 0 ? result.rows[0] : null;
      // console.log(data);
      return { error: false, data, message: "Data saved successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  update: async (reqObj, client) => {
    // console.log("reqObj", reqObj);
    try {
      const result = await client.query(
        `UPDATE events SET
        "name" = $2,
        "description" = $3,
        "category" = $4,
        "type" = $5,
        "address" = $6,
        "country" = $7,
        "city" = $8,
        "state" = $9,
        "postalCode" = $10,
        "virtualUrl" = $11,
        "password" = $12,
        "timezone" = $13,
        "startDate" = $14,
        "startTime" = $15,  
        "endDate" = $16,
        "endTime" = $17,
        "endVisible"  = $18,
        "image" = $19,
        "website" = $20,
        "twitter" = $21,
        "facebook" = $22,
        "instagram" = $23,
        "lat" = $24,
        "lng" = $25,
        "isActive" = $26,
				"updatedAt" = now()
				WHERE "eventId" = $1 RETURNING *`,
        [
          reqObj.eventId,
          reqObj.name,
          reqObj.description,
          reqObj.category,
          reqObj.type,
          reqObj.address,
          reqObj.country,
          reqObj.city,
          reqObj.state,
          reqObj.postalCode,
          reqObj.virtualUrl,
          reqObj.password,
          reqObj.timezone,
          reqObj.startDate,
          reqObj.startTime,
          reqObj.endDate,
          reqObj.endTime,
          reqObj.endVisible,
          reqObj.image,
          reqObj.website,
          reqObj.twitter,
          reqObj.facebook,
          reqObj.instagram,
          reqObj.lat,
          reqObj.lng,
          reqObj.isActive,
        ]
      );
      // .then((res) => console.log(res.rows[0]))
      // .catch((e) => console.error(e.stack));

      // console.log(result);

      let data = result.rowCount > 0 ? result.rows[0] : null;

      return { error: false, data, message: "Data update successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getAll: async (reqObj, client) => {
    // console.log(reqObj.uid);
    try {
      const limit = reqObj.limit ? reqObj.limit : 50;
      const pageNo =
        parseInt(reqObj.pageNo) === 1
          ? 0
          : (parseInt(reqObj.pageNo) - 1) * limit + 1;
      const result = await client.query(
        `SELECT "eventId", "userId", "name",
        "description",
        "category",
        "type",
        "address",
        "country",
        "city",
        "state",
        "postalCode",
        "virtualUrl",
        "password",
        "timezone",
        "startDate",
        "startTime",
        "endDate",
        "endTime",
        "endVisible",
        "image",
        "website",
        "twitter",
        "facebook",
        "instagram", "createdAt", "updatedAt", "lat", "lng", "isActive"
				FROM events
				WHERE "userId" = $1
        ORDER BY "createdAt" DESC`,
        [reqObj.uid]
      );
      const data = result.rows || [];
      return { error: false, data, message: "get all data successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getAllEvents: async (reqObj, client) => {
    // console.log(reqObj.uid);
    try {
      const limit = reqObj.limit ? reqObj.limit : 50;
      const pageNo =
        parseInt(reqObj.pageNo) === 1
          ? 0
          : (parseInt(reqObj.pageNo) - 1) * limit + 1;
      const result = await client.query(
        `SELECT "eventId", 
        "userId", 
        "name",
        "description",
        "category",
        "type",
        "address",
        "country",
        "city",
        "state",
        "postalCode",
        "virtualUrl",
        "password",
        "timezone",
        "startDate",
        "startTime",
        "endDate",
        "endTime",
        "endVisible",
        "image",
        "website",
        "twitter",
        "facebook",
        "instagram", 
        "createdAt", 
        "updatedAt",
        "lat", 
        "lng"
				FROM events
				WHERE "isActive" = $1
        ORDER BY "createdAt" ASC`,
        [true]
      );
      const data = result.rows || [];
      return { error: false, data, message: "get all data successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getOne: async (reqObj, client) => {
    const { currentUser } = reqObj;
    const id = reqObj.params ? reqObj.params.id : reqObj.eventId;
    try {
      const result = await client.query(
        `SELECT
				O."eventId", O."createdAt", O."updatedAt", O."userId", O."isActive", "description","name",
        "category",
        "type",
        "address",
        O."country",
        "city",
        "state",
        "postalCode",
        "virtualUrl",
        O."password",
        "timezone",
        "startDate",
        "startTime",
        "endDate",
        "endTime",
        "endVisible",
        "image",
        "website",
        "twitter",
        "facebook",
        "instagram",
        lat,
        lng
				FROM events O
				WHERE O."eventId" = $1`,
        [id]
      );
      const data = result.rows[0] || {};
      return { error: false, data };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  publish: async (reqObj, client) => {
    // console.log("reqObj", reqObj);
    try {
      const result = await client.query(
        `UPDATE events SET
        "isActive" = $2,
				"updatedAt" = now()
				WHERE "eventId" = $1 RETURNING *`,
        [reqObj.eventId, reqObj.isActive]
      );

      let data = result.rowCount > 0 ? result.rows[0] : null;

      return { error: false, data, message: "Data update successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  remove: async (id, client) => {
    try {
      const result = await client.query(
        `UPDATE loans SET "isActive" = $1  WHERE "loanId" = $2`,
        [false, id]
      );
      return {
        error: false,
        removedOfferId: id,
        message: "Loan removed successfully",
      };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },
};
