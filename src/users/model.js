const _isEmpty = require('lodash/isEmpty');

module.exports = {
	create: async (reqObj, client) => {
		try {
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

		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAll: async (reqObj, client) => {
		try {
			const limit = 50;
			const pageNo = reqObj.pageNo ? parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1 : 0;
			var queryText = `SELECT
			uid as userId, balance, "notificationUnReadcount", "deviceId", "fullName", "imageURl", "stripeCustomerId", latitude, longitude,
			"currencyCode",	"currencySymbol", profession, "isActive", created_at, "phoneNumber", "firebaseUId" as uid
			FROM users U
			WHERE "isActive" = $1`;
			var qryValue = [true, limit, pageNo]

			if (reqObj.recentUsers) {
				queryText = `${queryText} AND (created_at < current_date - interval '5 days')`;
			}

			if (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm)) {
				queryText = `${queryText} AND (LOWER("fullName") like LOWER($4) OR LOWER("profession") like LOWER($4))`;
				qryValue = [true, limit, pageNo, `%${reqObj.searchTerm}%`];
			}

			const result = await client.query(`${queryText} ORDER BY U.uid offset $3 limit $2 `, qryValue);
			const data = result.rows;
			if (result.rowCount > 0) {
				return { error: false, data, message: 'get all data successfully' };
			} else {
				return { error: false, message: "get all data failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getOne: async (obj, client) => {
		try {
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
				return { error: false, message: "get data failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	remove: async (id, client) => {
		try {
			const result = await client.query(`UPDATE users SET "isActive" = $1  WHERE uid = $2`, [false, id]);
			if (result.rowCount > 0) {
				return { error: false, removedUserId: id, message: 'user removed successfully' };
			} else {
				return { error: false, message: "user removed failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},
	update: async (Obj, client) => {
		try {
			const { reqObj, uid } = Obj;
			const result = await client.query(`UPDATE users SET
				balance = $2, "deviceId" = $3, "fullName" = $4,
				"imageURl" = $5, "phoneNumber" = $6, "stripeCustomerId" = $7,
				latitude = $8, longitude= $9, "currencyCode"= $10, "currencySymbol"= $11,
				profession= $12
				WHERE "firebaseUId" = $1`,
				[uid, reqObj.balance, `{${reqObj.deviceId}}`, reqObj.fullName,
				reqObj.imageURl, reqObj.phoneNumber, reqObj.stripeCustomerId, reqObj.latitude,
				reqObj.longitude, reqObj.currencyCode, reqObj.currencySymbol, reqObj.profession]);

			if (result.rowCount > 0) {
				return { error: false, message: 'Data update successfully' };
			} else {
				return { error: true, message: "Data update failed" };
			}
		} catch (error) {
			console.log('error', error);
			return { error: true, message: error.toString() };
		}
	},

	updateLocation: async (Obj, client) => {
		try {
			const { reqObj, uid } = Obj;
			const result = await client.query(`UPDATE users SET latitude = $2, "longitude" = $3
				WHERE uid = $1`,
				[uid, reqObj.latitude, reqObj.longitude ]);

			if (result.rowCount > 0) {
				return { error: false, message: 'Data update successfully' };
			} else {
				return { error: true, message: "Data update failed" };
			}
		} catch (error) {
			console.log('error', error);
			return { error: true, message: error.toString() };
		}
	},

	updateBlockedUsers: async (Obj, client) => {
		try {
			const { reqObj, uid } = Obj;
			const result = client.query(`INSERT INTO "users_blockedUsers" (uid, "blockedUserId") VALUES ($1, $2)`, [uid, reqObj.blockedUserId]);
			if (result) {
				return { error: false, message: 'Data update successfully' };
			} else {
				return { error: true, message: "Data update failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	}
};
