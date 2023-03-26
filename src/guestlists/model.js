const _isEmpty = require("lodash/isEmpty");
const format = require("pg-format");

module.exports = {
  create: async (reqObj, client) => {
    // console.log(reqObj);
    try {
      // let users = [['test@example.com', 'Fred'], ['test2@example.com', 'Lynda']];
      // let query1 = format('INSERT INTO users (email, name) VALUES %L returning id', users);
      const result = await client.query(
        format(
          `INSERT INTO guestlists
				(
          "guestlistId",
          "ticketId",
          "eventId",
          "transactionId",
          "name",
          "email",
          "type",
          "price",
          "startDate",
          "endDate"
        ) 
        VALUES %L RETURNING *`,
          reqObj
        )
      );

      let data = result.rowCount > 0 ? result.rows[0] : null;
      // console.log(data);
      return { error: false, data, message: "Data saved successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  checkin: async (Obj, client) => {
    try {
      const { guestlistId } = Obj;

      const result = await client.query(
        `UPDATE guestlists SET
				"checkedIn" = true,
				"updatedAt" = now()
				WHERE "guestlistId" = $1 RETURNING *`,
        [guestlistId]
      );

      let data = result.rowCount > 0 ? result.rows[0] : null;

      return { error: false, data, message: "Data update successfully" };
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
        "guestlistId",
        "ticketId",
        "eventId",
        "transactionId",
        "name",
        "email",
        "type",
        "price",
        "startDate",
        "endDate",
        "checkedIn"
				FROM guestlists
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
        "endDate",
        "checkedIn",
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
