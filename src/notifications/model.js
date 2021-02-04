const { v4: uuidv4 } = require('uuid');
module.exports = {
	create: async (reqObj, client) => {
		const result = await client.query(`INSERT INTO notifications("notificationId", offerid, "senderUId", "receiverUID")
		VALUES($1, $2, $3, $4) RETURNING "notificationId"`, [uuidv4(), reqObj.offerid, reqObj.senderUId, reqObj.receiverUID,]);
		if (result.rowCount > 0) {
			return { error: false, message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data save failed" };
		}
	},


	getUsersNotification: async (Obj, client) => {
		const result = await client.query(`SELECT "notificationId", offerid, "senderUId", "receiverUID", "createdAt",
			U.profession, U."imageURl" userImage, U."fullName"
			FROM notifications N
			INNER JOIN users U ON U.uid = N."senderUId"
		WHERE U.uid = $1`, [id]);
		const data = result.rows;
		if (result.rowCount > 0) {
			return { error: false, data, message: 'get notifications data successfully' };
		} else {
			return { error: true, message: "get notifications data failed" };
		}
	}
};
