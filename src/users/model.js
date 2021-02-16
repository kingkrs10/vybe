const { v4: uuidv4 } = require('uuid');
module.exports = {
	create: async (reqObj, client) => {
		const result = await client.query(`INSERT INTO users(
			uid, balance, "notificationUnReadcount", "deviceId",
			"fullName",	"imageURl", "phoneNumber", "stripeCustomerId",
			 "currencyCode", "currencySymbol", profession, "firebaseUId")
				VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING uid`,
			[reqObj.uid, reqObj.balance, 0, `{${reqObj.deviceId}}`,
			 reqObj.fullName, reqObj.imageURl, reqObj.phoneNumber, reqObj.stripeCustomerId,
			 reqObj.currencyCode,	reqObj.currencySymbol, reqObj.profession, reqObj.firebaseUId]);
		let data = null;
		if (result.rowCount > 0) {
			const result1 = await module.exports.getOne({ id: reqObj.firebaseUId}, client);
			data = result1 ? result1 : null;
		}
		if (result.rowCount > 0 && data) {
			return { error: false, data: data['data'], message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data save failed" };
		}
	},

	getAll: async (filter, client) => {
		const result = await client.query(`SELECT
		uid userId, balance, "notificationUnReadcount", "deviceId", "fullName", "imageURl", "phoneNumber", created_at, "stripeCustomerId", latitude,
		longitude, "currencyCode", "currencySymbol", profession, "firebaseUId" uid
		FROM users
		WHERE "isActive" = $1 ORDER BY uid`, [true]);
		const data = result.rows;
		if (result.rowCount > 0) {
			return { error: false, data, message: 'get all data successfully' };
		} else {
			return { error: true, message: "get all data failed" };
		}
	},

	getOne: async (obj, client) => {
		const whereCondition = obj.id ? `WHERE "firebaseUId" = $1` : `WHERE "phoneNumber" = $1`;
		const val = obj.id ? obj.id : obj.phoneNumber;
		const result = await client.query(`SELECT
		uid userId, balance, "notificationUnReadcount", "deviceId", "fullName", "imageURl", "phoneNumber", created_at, "stripeCustomerId", latitude,
		longitude, "currencyCode", "currencySymbol", profession, "firebaseUId" uid
		FROM users
		${whereCondition}`, [val]);
		const data = result.rows[0];
		if (result.rowCount > 0) {
			return { error: false, data, message: 'get data successfully' };
		} else {
			return { error: true, message: "get data failed" };
		}
	},

	remove: async (id, client) => {
		const result = await client.query(`UPDATE users SET "isActive" = $1  WHERE uid = $2`, [false, id]);
		if (result.rowCount > 0) {
			return { error: false, removedUserId: id, message: 'user removed successfully' };
		} else {
			return { error: true, message: "user removed failed" };
		}
	},

	update: async (Obj, client) => {
		const { reqObj, uid } = Obj;
		const result = await client.query(`UPDATE users SET
			balance = $2, "deviceId" = $3, "fullName" = $4,
			"imageURl" = $5, "phoneNumber" = $6, "stripeCustomerId" = $7,
			latitude = $8, longitude= $9, "currencyCode"= $10, "currencySymbol"= $11,
			profession= $12
			where "firebaseUId" = $1 RETURNING firebaseUId`,
			[uid, reqObj.balance, `{${reqObj.deviceId}}`, reqObj.fullName,
			reqObj.imageURl, reqObj.phoneNumber, reqObj.stripeCustomerId, reqObj.latitude,
			reqObj.longitude, reqObj.currencyCode, reqObj.currencySymbol, reqObj.profession]);
		let data = null;
		if (result.rowCount > 0) {
			const result1 = await module.exports.getOne({id:result.rows[0].uid}, client);
			data = result1 ? result1.data : null;
		}
		if (result.rowCount > 0) {
			return { error: false, data, message: 'Data update successfully' };
		} else {
			return { error: true, message: "Data update failed" };
		}
	},

	updateLocation: async (Obj, client) => {
		const { reqObj, uid } = Obj;
		const result = await client.query(`UPDATE users SET latitude = $2, "longitude" = $3
			where uid = $1 RETURNING firebaseUId`,
			[uid, reqObj.latitude, reqObj.longitude ]);
		let data = null;
		if (result.rowCount > 0) {
			const result1 = await module.exports.getOne({ id: result.rows[0].firebaseUId}, client);
			data = result1 ? result1.data : null;
		}
		if (result.rowCount > 0) {
			return { error: false, data, message: 'Data update successfully' };
		} else {
			return { error: true, message: "Data update failed" };
		}
	},

	updateBlockedUsers: async (Obj, client) => {
		const { reqObj, uid } = Obj;
		const result = client.query(`INSERT INTO "users_blockedUsers"(uid, "blockedUserId") VALUES ($1, $2)`, [uid, reqObj.blockedUserId]);
		if (result) {
			return { error: false, message: 'Data update successfully' };
		} else {
			return { error: true, message: "Data update failed" };
		}
	}
};
