const _isEmpty = require('lodash/isEmpty');
var self = module.exports = {
	create: async (reqObj, client) => {

		const imageURlData = Array.isArray(reqObj.imageURL) ? reqObj.imageURL : JSON.parse(reqObj.imageURL);
		const thumpImageData = Array.isArray(reqObj.thump_imageURL) ? reqObj.thump_imageURL : JSON.parse(reqObj.thump_imageURL);
		const mediumImageData = Array.isArray(reqObj.medium_imageURL) ? reqObj.medium_imageURL : JSON.parse(reqObj.medium_imageURL);

		try {
			const result = await client.query(`INSERT INTO offers
				(
					"offerId", "firebaseOfferId", "userId", "headLine", "offerDescription",
					"locationName", latitude, longitude,
					"offerImage", "offerThumpImage", "offerMediumImage"
				)
				VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
				[reqObj.offerId, reqObj.firebaseOfferId, reqObj.uid, reqObj.headLine, reqObj.offerDescription,
				reqObj.locationName, reqObj.latitude, reqObj.longitude, `{${imageURlData}}`, `{${thumpImageData}}`, `{${mediumImageData}}`]);

			let data = result.rowCount > 0 ? result.rows[0] : null;
			return { error: false, data, message: 'Data saved successfully' };

		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	update: async (Obj, client) => {
		try {
			const { reqObj, offerId } = Obj;
			const imageURlData = Array.isArray(reqObj.imageURL) ? reqObj.imageURL : JSON.parse(reqObj.imageURL);
			const thumpImageData = Array.isArray(reqObj.thump_imageURL) ? reqObj.thump_imageURL : JSON.parse(reqObj.thump_imageURL);
			const mediumImageData = Array.isArray(reqObj.medium_imageURL) ? reqObj.medium_imageURL : JSON.parse(reqObj.medium_imageURL);

			const result = await client.query(`UPDATE offers SET
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
				[offerId, reqObj.headLine, reqObj.offerDescription, reqObj.locationName, reqObj.latitude, reqObj.longitude, `{${imageURlData}}`,`{${thumpImageData}}`, `{${mediumImageData}}`]);

			let data = result.rowCount > 0 ? result.rows[0] : null;

			return { error: false, data, message: 'Data update successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAll: async (reqObj, client) => {
		try {
			const limit = reqObj.limit ? reqObj.limit : 50;
			const pageNo = parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1
			const result = await client.query(`SELECT * FROM (
				SELECT O."offerId", O."headLine",O.latitude, O.longitude, O."locationName",	O."offerDescription", O."userId",
				O."isActive", O."offerImage", "firebaseOfferId", O."offerThumpImage", O."offerMediumImage",  O."createdAt", O."updatedAt",
				(select count("userId") from offers_favorites OFS where  OFS."offerId" = O."offerId") as favoriterCount,
				(select count("userId") from offers_favorites OFS1 where  OFS1."offerId" = O."offerId" AND "userId" =  $1) as isFavorites,
				U.profession, U."userImage", U."userThumpImage", U."userMediumImage", U."fullName", U."firebaseUId" as uid,
				( 3959 * acos( cos( radians($5) ) * cos( radians( O.latitude ) ) * cos( radians( O.longitude ) - radians($6) ) + sin( radians($5) ) * sin( radians( O.latitude ) ) ) ) AS distance
				FROM offers O
				INNER JOIN users U ON U."userId" = O."userId"
				WHERE O."isActive" =  $2
				AND U."isActive" =  $2
				AND O."userId" not in (select "blockedUserId" from "users_blockedUsers" WHERE "userId" =  $1)
				AND O."offerId" not in (select "offerId" from offers_reports WHERE "reporterUserId" =  $1)
				ORDER BY O."createdAt" DESC) as tbl
				WHERE tbl.distance < 100
				offset $4 limit $3`, [reqObj.uid, true, limit, pageNo, reqObj.latitude, reqObj.longitude]);
			const data = result.rows || [];
			return { error: false, data, message: 'get all data successfully' };

		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getUserfavorites: async (reqObj, client) => {
		try {
			const limit =  250;
			const pageNo = reqObj.pageNo ? parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1 : 1;
			var qryText = `SELECT O."offerId", O."createdAt", O."updatedAt", O."headLine",O.latitude, O.longitude, O."locationName", O."offerDescription", O."userId", O."isActive",
				O."offerImage","firebaseOfferId", O."offerThumpImage", O."offerMediumImage",
				(select count("userId") from offers_favorites OFS WHERE  OFS."offerId" = O."offerId") as favoriterCount,
				(select count("userId") from offers_favorites OFS1 WHERE  OFS1."offerId" = O."offerId" AND "userId" =  $1) as isFavorites,
				U.profession, U."userImage", U."userThumpImage", U."userMediumImage", U."fullName",U."firebaseUId" uid,
				( 3959 * acos( cos( radians($3) ) * cos( radians( O.latitude ) ) * cos( radians( O.longitude ) - radians($4) ) + sin( radians($3) ) * sin( radians( O.latitude ) ) ) ) AS distance
				FROM offers O
				INNER JOIN users U ON U."userId" = O."userId"
				INNER JOIN offers_favorites fav ON  O."offerId" = fav."offerId"
				WHERE O."isActive" =  $2
				AND U."isActive" =  $2
				AND O."userId" not in (select "blockedUserId" from "users_blockedUsers" WHERE "userId" =  $1)
				AND O."offerId" not in (select "offerId" from offers_reports WHERE "reporterUserId" =  $1)
				AND fav."userId"=$1 `;

			// var qryValue = [reqObj.favoriteUid, true, reqObj.latitude, reqObj.longitude, limit, pageNo];
			// const result = await client.query(`${qryText} ORDER BY fav."createdAt" DESC offset $4 limit $3`, qryValue);

			var qryValue = [reqObj.favoriteUid, true, reqObj.latitude, reqObj.longitude];
			const result = await client.query(`${qryText} ORDER BY fav."createdAt" DESC`, qryValue);

			const data = result.rowCount > 0 ? result.rows : [];
			return { error: false, data, message: 'get all data successfully' };

		} catch (error) {
			return { error: true, message: error.toString()};
		}
	},

	getAllOffers: async (reqObj, client) => {
		try {
			const limit =  50;
			const pageNo = reqObj.pageNo ? parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1 : 1;
			const userId = reqObj.favoriteUid ? reqObj.favoriteUid : reqObj.userId;

			var qryText = `SELECT O."offerId", O."createdAt", O."updatedAt", O."headLine",O.latitude, O.longitude, O."locationName", O."offerDescription", O."userId", O."isActive",
				O."offerImage","firebaseOfferId", O."offerThumpImage", O."offerMediumImage",
				(select count("userId") from offers_favorites OFS WHERE  OFS."offerId" = O."offerId") as favoriterCount,
				(select count("userId") from offers_favorites OFS1 WHERE  OFS1."offerId" = O."offerId" AND "userId" =  $1) as isFavorites,
				U.profession, U."userImage", U."userThumpImage", U."userMediumImage", U."fullName",U."firebaseUId" as uid,
				( 3959 * acos( cos( radians($5) ) * cos( radians( O.latitude ) ) * cos( radians( O.longitude ) - radians($6) ) + sin( radians($5) ) * sin( radians( O.latitude ) ) ) ) AS distance
				FROM offers O
				INNER JOIN users U ON U."userId" = O."userId"
				WHERE O."isActive" =  $2
				AND U."isActive" =  $2
				AND O."userId" not in (select "blockedUserId" from "users_blockedUsers" WHERE "userId" =  $1)
				AND O."offerId" not in (select "offerId" from offers_reports WHERE "reporterUserId" =  $1)`;
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
				qryText = `${qryText} AND O."userId" = $7`;
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, reqObj.uid]
			} else if (reqObj.favoriteUid) {
				qryText = `${qryText} AND O."offerId" in (SELECT "offerId" FROM "offers_favorites" WHERE "userId" = $7)`;
				qryValue = [userId, true, limit, pageNo,  reqObj.latitude, reqObj.longitude, reqObj.favoriteUid]
			}
			const result = await client.query(`${qryText} ORDER BY O."createdAt" DESC offset $4 limit $3`, qryValue);
			const data = result.rowCount > 0 ? result.rows : [];
			return { error: false, data, message: 'get all data successfully' };
		} catch (error) {
			return { error: true, message: error.toString()};
		}
	},

	getOfferFavoriters: async (reqObj, client) => {
		try {
			var qryText = `SELECT O."offerId", O."createdAt" as "offerCreatedAt", O."headLine", O."offerDescription",
				O."offerImage", O."offerThumpImage", O."offerMediumImage",
				U."firebaseUId" uid, U."fullName", U.profession, U."userImage", U."userThumpImage", U."userMediumImage",
				fav."createdAt" as "createdAtOffersFavorites"
				FROM offers O
				INNER JOIN offers_favorites fav ON  O."offerId" = fav."offerId"
				INNER JOIN users U ON U."userId" = fav."userId"
				WHERE O."isActive" =  $2
				AND U."isActive" =  $2
				AND O."userId" = $1`;
			var qryValue = [reqObj.uid, true];
			const result = await client.query(`${qryText} ORDER BY fav."createdAt" DESC`, qryValue);

			const data = result.rows || [];
			return { error: false, data, message: 'get all data successfully' };

		} catch (error) {
			return { error: true, message: error.toString()};
		}
	},

	getOne: async (reqObj, client) => {
		const { currentUser} = reqObj;
		const id = reqObj.params ? reqObj.params.id : reqObj.offerId;
		try {
			const result = await client.query(`SELECT
				O."offerId", O."createdAt", O."updatedAt", O."headLine",O.latitude, O.longitude, O."locationName", O."offerDescription", O."userId", O."isActive",
				O."offerImage", "firebaseOfferId", O."offerThumpImage", O."offerMediumImage",
				U.profession,U."userImage", U."userThumpImage", U."userMediumImage", U."fullName", U."firebaseUId" uid,
				(select count("userId") from offers_favorites OFS where  OFS."offerId" = $1) as favoriterCount,
				( 3959 * acos( cos( radians($2) ) * cos( radians( O.latitude ) ) * cos( radians( O.longitude ) - radians($3) ) + sin( radians($2) ) * sin( radians( O.latitude ) ) ) ) AS distance
				FROM offers O
				INNER JOIN users U ON U."userId" = O."userId"
				WHERE O."offerId" = $1`, [id, currentUser.latitude, currentUser.longitude]);
			const data = result.rows[0] || {};
			return {error: false, data};
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	remove: async (id, client) => {
		try {
			const result = await client.query(`UPDATE offers SET "isActive" = $1  WHERE "offerId" = $2`, [false, id]);
			return { error: false, removedOfferId: id, message: 'Offer removed successfully' };
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
			const data = result.rows || [];
			return data;
		} catch (error){
			return { error: true, message: error.toString() };
		}
	},

	saveFavorites: async (reqObj, client) => {
		try {
			var result = {};
			if (!Boolean(Number(reqObj.isFavorite))) {
				result = await client.query(`DELETE FROM "offers_favorites" WHERE "offerId" = $1 AND "userId" = $2`, [reqObj.offerId, reqObj.uid]);
			} else {
				result = await client.query(`INSERT INTO "offers_favorites"("offerId", "userId") VALUES ($1, $2)`, [reqObj.offerId, reqObj.uid]);
			}
			return { error: false, message: 'Data updated successfully' };

		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	saveReport: async (reqObj, client) => {
		try {
			const result = await client.query(`INSERT INTO offers_reports("offerId", "reporterUserId",comment)
			VALUES ($1, $2, $3)`, [reqObj.offerId, reqObj.reporterUId, reqObj.comment]);
			return { error: false, message: 'Data saved successfully' };

		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAllCategories: async (reqObj, client) => {
		try {
			var qry = `SELECT DISTINCT "hashTag" as name,  count(OH."offerId") as length
			FROM "offers_hashTags" OH
			INNER JOIN "offers" O on O."offerId" = OH."offerId"
            INNER JOIN users U ON U."userId" = O."userId"
			WHERE O."isActive" = $2
			AND U."isActive" = $2
			AND O."userId" not in (select "blockedUserId" from "users_blockedUsers" WHERE "userId" =  $1)
			AND O."offerId" not in (select "offerId" from offers_reports WHERE "reporterUserId" =  $1)`;
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

			return { error: false, data: result.rows || [], message: 'Get Data successfully' };
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAllLocation: async (reqObj, client) => {
		try {
			var qry = `SELECT DISTINCT "locationName" as name, count("offerId") as length
			FROM "offers" AS O
            INNER JOIN users U ON U."userId" = O."userId"
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
			const data = result.rows || [];
			return { error: false, data: data, message: 'Get Data successfully' };
		} catch (error) {
			return { error: true, message: error.toString()};
		}
	}
};
