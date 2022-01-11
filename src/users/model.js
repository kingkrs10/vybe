const _isEmpty = require('lodash/isEmpty');

module.exports = {
	create: async (reqObj, client) => {
		try {
			const result = await client.query(`INSERT INTO users(
				"userId", balance, "notificationUnReadcount", "deviceId",
				"fullName",	"phoneNumber", "stripeCustomerId",
				"currencyCode", "currencySymbol", profession, "firebaseUId",
				"userImage", "userThumpImage", "userMediumImage")
				VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
				[reqObj.uid, reqObj.balance, 0, `{${reqObj.deviceId}}`,
				reqObj.fullName, reqObj.phoneNumber, reqObj.stripeCustomerId,
				reqObj.currencyCode, reqObj.currencySymbol, reqObj.profession, reqObj.firebaseUId,
				reqObj.imageURl, reqObj.thump_imageURL, reqObj.medium_imageURL
			]);
			let resultData = result.rowCount ? result.rows[0] : {};
			return { error: false, data: resultData, message: 'Data saved successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAll: async (reqObj, client) => {
		try {
			const limit = 50;
			const pageNo = reqObj.pageNo ? parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1 : 0;

			var queryText = `SELECT
			"userId", balance, "notificationUnReadcount", "deviceId", "fullName", "stripeCustomerId", latitude, longitude,
			"currencyCode",	"currencySymbol", profession, "isActive", "createdAt", "phoneNumber", "firebaseUId" as uid, "userImage", "userThumpImage", "userMediumImage",
			( 3959 * acos( cos( radians($4) ) * cos( radians( U.latitude ) ) * cos( radians( U.longitude ) - radians($5) ) + sin( radians($4) ) * sin( radians( U.latitude ) ) ) ) AS distance
			FROM users U
			WHERE "isActive" = $1`;
			var qryValue = [true, limit, pageNo, reqObj.latitude, reqObj.longitude]

			if (reqObj.recentUsers) {
				queryText = `${queryText} AND ("createdAt" > current_date - interval '7 days')`;
			}

			if (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm)) {
				queryText = `${queryText} AND (LOWER("fullName") like LOWER($6) OR LOWER("profession") like LOWER($6))`;
				qryValue = [true, limit, pageNo, reqObj.latitude, reqObj.longitude, `%${reqObj.searchTerm}%`];
			}

			const result = await client.query(`${queryText} ORDER BY U."userId" offset $3 limit $2 `, qryValue);
			const data = result.rows || [];
			return { error: false, data, message: 'get all data successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getOne: async (obj, client) => {
		try {
			const whereCondition = obj.uid ? `WHERE "userId" =$1` : obj.id ? `WHERE "firebaseUId" = $1` : `WHERE "phoneNumber" = $1`;
			const val = obj.uid ? obj.uid : obj.id ? obj.id : obj.phoneNumber;
			const result = await client.query(`SELECT
			"userId", balance, "notificationUnReadcount", "deviceId", "fullName", "phoneNumber", "createdAt", "stripeCustomerId", latitude,
			longitude, "currencyCode", "currencySymbol", profession, "firebaseUId", "userImage", "userThumpImage", "userMediumImage"
			FROM users
			${whereCondition}`, [val]);
			const data = result.rows[0] || {};
			return { error: false, data, message: 'get data successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	remove: async (id, client) => {
		try {
			const result = await client.query(`UPDATE users SET "isActive" = $1  WHERE "userId" = $2`, [false, id]);
			return { error: false, removedUserId: id, message: 'user removed successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	update: async (Obj, client) => {
		try {
			const { reqObj, uid } = Obj;
			const result = await client.query(`UPDATE users SET
				balance = $2,
				"deviceId" = $3,
				"fullName" = $4,
				"phoneNumber" = $5,
				"stripeCustomerId" = $6,
				latitude = $7,
				longitude= $8,
				"currencyCode"= $9,
				"currencySymbol"= $10,
				profession= $11,
				"userImage" = $12,
				"userThumpImage"= $13,
				"userMediumImage"= $14
				WHERE "firebaseUId" = $1 RETURNING *`,
				[
					uid,
					reqObj.balance,
					`{${reqObj.deviceId}}`,
					reqObj.fullName,
					reqObj.phoneNumber,
					reqObj.stripeCustomerId,
					reqObj.latitude,
					reqObj.longitude,
					reqObj.currencyCode,
					reqObj.currencySymbol,
					reqObj.profession,
					reqObj.imageURl,
					reqObj.thump_imageURL,
					reqObj.medium_imageURL
				]);

			let data = result.rowCount > 0 ? result.rows[0] : null;
			return { error: false, data: data, message: 'Data saved successfully' };

		} catch (error) {
			console.log('update', error);
			return { error: true, message: error.toString() };
		}
	},

	updateLocation: async (Obj, client) => {
		try {
			const { reqObj, uid } = Obj;
			const result = await client.query(`UPDATE users SET latitude = $2, "longitude" = $3
				WHERE "userId" = $1  RETURNING *`,
				[uid, reqObj.latitude, reqObj.longitude]);

			let data = result.rowCount ? result.rows[0] : null;
			return { error: false, data: data, message: 'Data saved successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	updateBlockedUsers: async (Obj, client) => {
		try {
			const { reqObj, uid } = Obj;
			const result = client.query(`INSERT INTO "users_blockedUsers" ("userId", "blockedUserId")
			VALUES ($1, $2)`, [uid, reqObj.blockedUserId]);

			return { error: false, message: 'Data update successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	updateStripeId: async (reqObj, client) => {
		try {
			const result = await client.query(`UPDATE users SET
				"stripeCustomerId" = $2
				WHERE "userId" = $1`,
				[reqObj.uid, reqObj.stripeCustomerId]);
			return { error: false, message: 'Data update successfully' };

		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getBlockedUsers: async (obj, client) => {
		try {
			const result = await client.query(`
			SELECT "blockedUserId", U."firebaseUId"
			FROM "users_blockedUsers" BU
			INNER JOIN users U ON U."userId" = BU."blockedUserId" where BU."userId" = $1`, [obj.id]);

			const data = result.rowCount ? result.rows.map(item => item.firebaseUId) : [];
			return { error: false, data: data, message: 'Data fetched successfully' };

		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	updateBalance: async (reqObj, client) => {
		try {
			const result = await client.query(`UPDATE users SET
				balance = $2, "currencyCode"= $3, "currencySymbol"= $4
				WHERE "userId" = $1`,
			[reqObj.uid, reqObj.balance, reqObj.currencyCode, reqObj.currencySymbol]);

			return { error: false, message: 'Data update successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	updateMobileNumber: async (obj, client) => {
		try {
			const { reqObj, uid } = obj;
			const result = await client.query(`UPDATE users SET "phoneNumber" = $2
				WHERE "firebaseUId" = $1 RETURNING *`, [uid, reqObj.phoneNumber]
			)
			return { error: false, data: result.rows || [], message: 'Data update successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	}
};
