const _isEmpty = require("lodash/isEmpty");

module.exports = {
  create: async (reqObj, client) => {
    // console.log(reqObj);
    try {
      const result = await client.query(
        `INSERT INTO transactions
				(
          "transactionId",
          "userId",
          "eventId",
          "stripeCustomerId",
          "totalAmount",
          "feeAmount",
          "subTotal",
          "rawData"
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [
          reqObj.transactionId,
          reqObj.userId,
          reqObj.eventId,
          reqObj.customerId,
          reqObj.total.totalAmount,
          reqObj.total.fee,
          reqObj.total.subtotal,
          reqObj.rawData,
        ]
      );

      let data = result.rowCount > 0 ? result.rows[0] : null;
      // console.log(data);
      return { error: false, data, message: "Data saved successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  update: async (Obj, client) => {
    try {
      const { reqObj, offerId } = Obj;

      const result = await client.query(
        `UPDATE loans SET
				"headLine" = $2,
				"offerDescription" = $3,
				"locationName" = $4,
				latitude = $5,
				longitude = $6,
				"offerImage" = $7,
				"offerThumpImage" = $8,
				"offerMediumImage" = $9,
				"updatedAt" = now()
				WHERE "offerId" = $1 RETURNING *`,
        [
          offerId,
          reqObj.headLine,
          reqObj.offerDescription,
          reqObj.locationName,
          reqObj.latitude,
          reqObj.longitude,
        ]
      );

      let data = result.rowCount > 0 ? result.rows[0] : null;

      return { error: false, data, message: "Data update successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getAll: async (reqObj, client) => {
    // console.log(reqObj.eventId);
    try {
      const limit = reqObj.limit ? reqObj.limit : 50;
      const pageNo =
        parseInt(reqObj.pageNo) === 1
          ? 0
          : (parseInt(reqObj.pageNo) - 1) * limit + 1;
      const result = await client.query(
        `SELECT
          "transactionId",
          "userId",
          "eventId",
          "stripeCustomerId",
          "ticketsSold",
          "totalAmount",
          "feeAmount",
          "subTotal",
          "rawData"
				FROM transactions
				WHERE "eventId" = $1`,
        [reqObj.eventId]
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
				"ticketId",
        "eventId",
        "name",
        "description",
        "type",
        "price",
        "quantity",
        "limit",
        "startDate",
        "startTime",
        "endDate",
        "endTime",
        "invitationOnly" 
				FROM tickets
				WHERE "eventId" = $1`,
        [id]
      );
      const data = result.rows[0] || {};
      return { error: false, data };
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
