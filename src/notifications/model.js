const { v4: uuidv4 } = require('uuid');
module.exports = {
	create: async (reqObj, client) => {
		try {
			const notificationId = uuidv4();
			const result = await client.query(`INSERT INTO notifications("notificationId", "offerId", "senderUId", "receiverUId")
			VALUES($1, $2, $3, $4) RETURNING "notificationId"`, [notificationId, reqObj.offerId, reqObj.senderUId, reqObj.receiverUId]);
			if (result.rowCount > 0) {
				return { error: false, message: 'Data saved successfully' };
			} else {
				return { error: true, message: "Data save failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getUsersNotification: async (id, client) => {
		try {
			const result = await client.query(`SELECT "notificationId", "offerId", "senderUId", "receiverUId", "createdAt",
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
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	}
};
