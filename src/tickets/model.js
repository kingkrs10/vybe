const _isEmpty = require("lodash/isEmpty");

module.exports = {
  create: async (reqObj, client) => {
    try {
      const result = await client.query(
        `INSERT INTO tickets
				("ticketId",
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
        "invitationOnly") 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
        [
          reqObj.ticketId,
          reqObj.eventId,
          reqObj.name,
          reqObj.description,
          reqObj.type,
          reqObj.price,
          reqObj.quantity,
          reqObj.limit,
          reqObj.startDate,
          reqObj.startTime,
          reqObj.endDate,
          reqObj.endTime,
          reqObj.invitationOnly,
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
        `SELECT "ticketId",
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
				WHERE "eventId" = $1
        AND "isActive" = $2
        ORDER BY "createdAt" ASC`,
        [reqObj.eventId, true]
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
        `UPDATE tickets SET "isActive" = $1 WHERE "ticketId" = $2`,
        [false, id]
      );
      // .catch((e) => console.error(e.stack));
      return {
        error: false,
        removedTicketId: id,
        message: "Ticket removed successfully",
      };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },
};
