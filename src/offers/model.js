const _isEmpty = require('lodash/isEmpty');
var self = module.exports = {
	create: async (reqObj, client) => {
		const imageURlData = Array.isArray(reqObj.imageURl) ? reqObj.imageURl : JSON.parse(reqObj.imageURl);
		const thump_imageURLData = Array.isArray(reqObj.thump_imageURl) ? reqObj.thump_imageURl : JSON.parse(reqObj.thump_imageURL);
		const medium_imageURLData = Array.isArray(reqObj.medium_imageURL) ? reqObj.medium_imageURL : JSON.parse(reqObj.medium_imageURL);
		try {
			const result = await client.query(`INSERT INTO offers("offerId", "headLine", "imageURl",  latitude, longitude, "offerDescription", uid, "locationName", "firebaseOfferId", "thump_imageURL", "medium_imageURL")
					VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
				[reqObj.offerId, reqObj.headLine, `{${imageURlData}}`, reqObj.latitude, reqObj.longitude, reqObj.offerDescription, reqObj.uid, reqObj.locationName, reqObj.firebaseOfferId,`{${thump_imageURLData}}`, `{${medium_imageURLData}}`]);
			let data = null;
			if (result.rowCount > 0) {
				const Obj = { reqObj: reqObj, offerId: reqObj.offerId};
				const result1 = await module.exports.getOne(reqObj, client);
				data = result1 ? result1.data : null;
				await self.updateHashTags(Obj, client);
			}
			if (result.rowCount > 0 && data) {
				return { error: false, data, message: 'Data saved successfully' };
			} else {
				return { error: true, message: "Data save failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	update: async (Obj, client) => {
		try {
			const { reqObj, offerId } = Obj;
			const imageURlData = Array.isArray(reqObj.imageURL) ? reqObj.imageURL : JSON.parse(reqObj.imageURL);
			const thump_imageURLData = Array.isArray(reqObj.thump_imageURL) ? reqObj.thump_imageURL : JSON.parse(reqObj.thump_imageURL);
			const medium_imageURLData = Array.isArray(reqObj.medium_imageURL) ? reqObj.medium_imageURL : JSON.parse(reqObj.medium_imageURL);
			const result = await client.query(`UPDATE offers SET
				"headLine" = $2,
				"imageURl" = $3,
				latitude = $4,
				longitude = $5,
				"locationName" = $6,
				"offerDescription" = $7,
				"thump_imageURL" = $8,
				"medium_imageURL" = $9,
				"updatedAt" = now()
				WHERE "offerId" = $1 RETURNING "offerId"`,
				[offerId, reqObj.headLine, `{${imageURlData}}`, reqObj.latitude, reqObj.longitude, reqObj.locationName, reqObj.offerDescription, `{${thump_imageURLData}}`, `{${medium_imageURLData}}`]);
			let data = null;
			if (result.rowCount > 0) {
				const Obj = { reqObj: reqObj, offerId: offerId};
				const result1 = await module.exports.getOne({...reqObj, offerId: offerId}, client);
				await self.updateHashTags(Obj, client);
				data = result1 ? result1.data : null;
			}
			if (result.rowCount > 0) {
				return { error: false, data, message: 'Data update successfully' };
			} else {
				return { error: true, message: "Data update failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAll: async (reqObj, client) => {
		try {
			const limit = reqObj.limit ? reqObj.limit : 50;
			const pageNo = parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1
			const result = await client.query(`SELECT * FROM (SELECT O."offerId", O."createdAt", O."updatedAt", O."headLine",O.latitude, O.longitude, O."locationName" "offerDescription", O.uid userId, O."isActive",
				O."imageURl" offerImage,"firebaseOfferId", O."thump_imageURL" as offerThumpImage, O."medium_imageURL" as offerMediumImage,
				(select count(uid) from offers_favorites OFS where  OFS."offerId" = O."offerId") as favoriterCount,
				(select count(uid) from offers_favorites OFS1 where  OFS1."offerId" = O."offerId" AND uid =  $1) as isFavorites,
				U.profession, U."imageURl" userImage, U."fullName",U."firebaseUId" uid,
				( 3959 * acos( cos( radians($5) ) * cos( radians( O.latitude ) ) * cos( radians( O.longitude ) - radians($6) ) + sin( radians($5) ) * sin( radians( O.latitude ) ) ) ) AS distance
				FROM offers O
				INNER JOIN users U ON U.uid = O.uid
				WHERE O."isActive" =  $2
				AND U."isActive" =  $2
				AND O.uid not in (select "blockedUserId" from "users_blockedUsers" WHERE uid =  $1)
				AND O."offerId" not in (select "offerId" from offers_reports WHERE "reporterUId" =  $1)
				ORDER BY O."createdAt" DESC) as tbl
				WHERE tbl.distance < 100
				offset $4 limit $3`, [reqObj.uid, true, limit, pageNo, reqObj.latitude, reqObj.longitude]);
			const data = result.rows;
			if (result.rowCount > 0) {
				return { error: false, data, message: 'get all data successfully' };
			} else {
				return { error: true, message: "get all data failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAllOffers: async (reqObj, client) => {
		try {
			const limit =  50;
			const pageNo = reqObj.pageNo ? parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1 : 1;
			const userId = reqObj.favoriteUid ? reqObj.favoriteUid : reqObj.userId;

			var qryText = `SELECT O."offerId", O."createdAt", O."updatedAt", O."headLine",O.latitude, O.longitude, O."locationName", O."offerDescription", O.uid userId, O."isActive",
				O."imageURl" offerImage,"firebaseOfferId", O."thump_imageURL" as offerThumpImage, O."medium_imageURL" as offerMediumImage,
				(select count(uid) from offers_favorites OFS WHERE  OFS."offerId" = O."offerId") as favoriterCount,
				(select count(uid) from offers_favorites OFS1 WHERE  OFS1."offerId" = O."offerId" AND uid =  $1) as isFavorites,
				U.profession, U."imageURl" userImage, U."fullName",U."firebaseUId" uid,
				( 3959 * acos( cos( radians($5) ) * cos( radians( O.latitude ) ) * cos( radians( O.longitude ) - radians($6) ) + sin( radians($5) ) * sin( radians( O.latitude ) ) ) ) AS distance
				FROM offers O
				INNER JOIN users U ON U.uid = O.uid
				WHERE O."isActive" =  $2
				AND U."isActive" =  $2
				AND O.uid not in (select "blockedUserId" from "users_blockedUsers" WHERE uid =  $1)
				AND O."offerId" not in (select "offerId" from offers_reports WHERE "reporterUId" =  $1)`;
			var qryValue = [userId, true, limit, pageNo, reqObj.latitude, reqObj.longitude];

			if ((reqObj.category && !_isEmpty(reqObj.category)) && (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm))){
					qryText = `${qryText} AND O."offerId" in (SELECT "offerId" FROM "offers_hashTags" WHERE LOWER("hashTag") = LOWER($7))`
					qryText = `${qryText} AND (LOWER("headLine") like LOWER($8)
						OR LOWER("offerDescription") like LOWER($8)
						OR LOWER("locationName") like LOWER($8))`
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, reqObj.category, `%${reqObj.searchTerm}%`]

			} else if ((reqObj.category && !_isEmpty(reqObj.category)) && (!reqObj.searchTerm || _isEmpty(reqObj.searchTerm))){
				qryText = `${qryText} AND O."offerId" in (SELECT "offerId" FROM "offers_hashTags" WHERE LOWER("hashTag") = LOWER($7))`;
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, reqObj.category]

			}else if ((reqObj.location && !_isEmpty(reqObj.location)) && (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm))){
				qryText = `${qryText} AND LOWER(O."locationName") = LOWER($7)`;
					qryText = `${qryText} AND (LOWER("headLine") like LOWER($8)
						OR LOWER("offerDescription") like LOWER($8)
						OR LOWER("locationName") like LOWER($8))`
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, reqObj.location, `%${reqObj.searchTerm}%`]

			} else if ((reqObj.location && !_isEmpty(reqObj.location)) && (!reqObj.searchTerm || _isEmpty(reqObj.searchTerm))){
				qryText = `${qryText} AND LOWER(O."locationName") = LOWER($7)`;
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, reqObj.location];
			} else if (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm)){
				qryText = `${qryText} AND (LOWER("headLine") like LOWER($7)
						OR LOWER("offerDescription") like LOWER($7)
						OR LOWER("locationName") like LOWER($7))`;
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, `%${reqObj.searchTerm}%`]
			} else if (reqObj.uid) {
				qryText = `${qryText} AND O.uid = $7`;
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, reqObj.uid]
			} else if (reqObj.favoriteUid) {
				qryText = `${qryText} AND O."offerId" in (SELECT "offerId" FROM "offers_favorites" WHERE uid = $7)`;
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, reqObj.favoriteUid]
			}
			const result = await client.query(`${qryText} ORDER BY O."createdAt" DESC offset $4 limit $3`, qryValue);
			const data = result.rows;
			if (result.rowCount > 0) {
				return { error: false, data, message: 'get all data successfully' };
			} else {
				return { error: false, data:[], message: "get all data failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString()};
		}
	},

	getOne: async (reqObj, client) => {
		const { currentUser} = reqObj;
		const id = reqObj.params ? reqObj.params.id : reqObj.offerId;
		try {
			const result = await client.query(`SELECT
				O."offerId", O."createdAt", O."updatedAt", O."headLine",O.latitude, O.longitude, O."locationName" "offerDescription", O.uid userId, O."isActive",
				O."imageURl" offerImage, "firebaseOfferId", O."thump_imageURL" as offerThumpImage, O."medium_imageURL" as offerMediumImage,
				U.profession, U."imageURl" userImage, U."fullName",U."firebaseUId" uid,
				(select count(uid) from offers_favorites OFS where  OFS."offerId" = $1) as favoriterCount,
				( 3959 * acos( cos( radians($2) ) * cos( radians( O.latitude ) ) * cos( radians( O.longitude ) - radians($3) ) + sin( radians($2) ) * sin( radians( O.latitude ) ) ) ) AS distance
				FROM offers O
				INNER JOIN users U ON U.uid = O.uid
				WHERE O."offerId" = $1`, [id, currentUser.latitude, currentUser.longitude]);
			const data = result.rows[0];
			if (result.rowCount > 0) {
				return {error: false, data};
			} else {
				return { error: false, data:[]};
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	remove: async (id, client) => {
		try {
			const result = await client.query(`UPDATE offers SET "isActive" = $1  WHERE "offerId" = $2`, [false, id]);
			if (result.rowCount > 0) {
				return { error: false, removedOfferId: id, message: 'Offer removed successfully' };
			} else {
				return { error: true, message: "Offer removed failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	updateHashTags: async (Obj, client) => {
		try {
			const { reqObj, offerId } = Obj;
			var result = false;
			const hashTagsData = Array.isArray(reqObj.hashTags) ? reqObj.hashTags : JSON.parse(reqObj.hashTags);
			await client.query(`DELETE FROM "offers_hashTags" WHERE "offerId" = $1`, [offerId]);
			await hashTagsData.map(item => {
				client.query(`INSERT INTO "offers_hashTags"("offerId", "hashTag") VALUES ($1, $2)`, [offerId, item]);
				result = true;
			});
			return { error: false, message: 'Data update successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getHashTags: async (ids, client) => {
		try{
			const result = await client.query(`SELECT "offerId", "hashTag" FROM "offers_hashTags" WHERE "offerId" = ANY(ARRAY[$1::uuid[]])`, [ids]);
			const data = result.rows;
			if (result.rowCount > 0) {
				return data;
			} else {
				return [];
			}
		} catch (error){
			return { error: true, message: error.toString() };
		}
	},

	saveFavorites: async (reqObj, client) => {
		try {
			var result = {};
			if (!Boolean(Number(reqObj.isFavorite))) {
				result = await client.query(`DELETE FROM "offers_favorites" WHERE "offerId" = $1 AND uid = $2`, [reqObj.offerId, reqObj.uid]);
			} else {
				result = await client.query(`INSERT INTO "offers_favorites"("offerId", uid) VALUES ($1, $2)`, [reqObj.offerId, reqObj.uid]);
			}
			if (result.rowCount > 0) {
				return { error: false, message: 'Data updated successfully' };
			} else {
				return { error: true, message: "Data saved failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	saveReport: async (reqObj, client) => {
		try {
			const result = await client.query(`INSERT INTO offers_reports("offerId", "reporterUId",comment)
			VALUES ($1, $2, $3)`, [reqObj.offerId, reqObj.reporterUId, reqObj.comment]);

			if (result.rowCount > 0) {
				return { error: false, message: 'Data saved successfully' };
			} else {
				return { error: true, message: "Data saved failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAllCategories: async (reqObj, client) => {
		try {
			var qry = `SELECT DISTINCT "hashTag" as name,  count(OH."offerId") as length
			FROM "offers_hashTags" OH
			INNER JOIN "offers" O on O."offerId" = OH."offerId"
            INNER JOIN users U ON U.uid = O.uid
			WHERE O."isActive" = $2
			AND U."isActive" = $2
			AND O.uid not in (select "blockedUserId" from "users_blockedUsers" WHERE uid =  $1)
			AND O."offerId" not in (select "offerId" from offers_reports WHERE "reporterUId" =  $1)`;
			var qryValue = [reqObj.userId,true];

			if (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm)) {
				qry = `${qry}
				AND (LOWER("hashTag") like LOWER($3)
				OR LOWER("headLine") like LOWER($3)
				OR LOWER("offerDescription") like LOWER($3)
				OR LOWER("locationName") like LOWER($3))`;
				qryValue = [reqObj.userId, true, `%${reqObj.searchTerm}%`];
			}
			const result = await client.query(`${qry} group by name`, qryValue);
			if (result.rowCount > 0) {
				return { error: false, data: result.rows, message: 'Get Data successfully' };
			} else {
				return { error: false, data: [], message: 'Get Data successfully' };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAllLocation: async (reqObj, client) => {
		try {
			var qry = `SELECT DISTINCT "locationName" as name, count("offerId") as length
			FROM "offers" AS O
            INNER JOIN users U ON U.uid = O.uid
			WHERE O."isActive" = $1
            AND U."isActive" = $1`;
			var qryValue = [true];

			if (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm)) {
				qry = `${qry} AND (LOWER("locationName") like LOWER($2)
				OR LOWER("headLine") like LOWER($2)
				OR LOWER("offerDescription") like LOWER($2))` ;
				qryValue = [true, `%${reqObj.searchTerm}%`];
			}
			const result = await client.query(`${qry} group by "name"`, qryValue);
			if (result.rowCount > 0) {
				return { error: false, data: result.rows, message: 'Get Data successfully' };
			} else {
				return { error: false, data: [], message: "Get Data failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString()};
		}
	}
};
