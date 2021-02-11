var self = module.exports = {
	create: async (reqObj, client) => {
		const result = await client.query(`INSERT INTO offers("offerId", "headLine", "imageURl", latitude, longitude, "offerDescription", uid)
				VALUES($1, $2, $3, $4, $5, $6, $7)`,
			[reqObj.offerId, reqObj.headLine, reqObj.imageURl, reqObj.latitude, reqObj.longitude, reqObj.offerDescription, reqObj.uid]);
		let data = null;
		if (result.rowCount > 0) {
			const Obj = { reqObj: reqObj, offerId: reqObj.offerId};
			const result1 = await module.exports.getOne(reqObj.offerId, client);
			await self.updateHashTags(Obj, client);
			data = result1 ? result1 : null;
		}
		if (result.rowCount > 0 && data) {
			return { error: false, data, message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data save failed" };
		}
	},

	update: async (Obj, client) => {
		const { reqObj, offerId } = Obj;
		const result = await client.query(`UPDATE offers SET
			"headLine" = $2, "imageURl" = $3, latitude = $4, longitude = $5, "locationName" = $6, "offerDescription" = $7, "updatedAt" = now()
			WHERE "offerId" = $1 RETURNING "offerId"`,
			[offerId, reqObj.headLine, reqObj.imageURl, reqObj.latitude, reqObj.longitude, reqObj.locationName, reqObj.offerDescription]);
		let data = null;
		if (result.rowCount > 0) {
			const result1 = await module.exports.getOne(result.rows[0].offerId, client);
			await self.updateHashTags(Obj, client);
			data = result1 ? result1 : null;
		}
		if (result.rowCount > 0) {
			return { error: false, data, message: 'Data update successfully' };
		} else {
			return { error: true, message: "Data update failed" };
		}
	},

	getAll: async (reqObj, client) => {
		const limit = 5
		const pageNo = parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1
		const result = await client.query(`SELECT * FROM (SELECT O."offerId", O."createdAt", O."updatedAt", O."headLine",O.latitude, O.longitude, O."locationName" "offerDescription", O.uid, O."isActive",
			(select count(uid) from offers_favorites OFS where  OFS."offerId" = O."offerId") as favoriterCount,
			(select count(uid) from offers_favorites OFS1 where  OFS1."offerId" = O."offerId" AND uid =  $1) as isFavorites,
			U.profession, U."imageURl" userImage, U."fullName",
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
	},

	getOne: async (id, client) => {
		const result = await client.query(`SELECT
			O."offerId", O."createdAt", O."updatedAt", O."headLine",O.latitude, O.longitude, O."locationName" "offerDescription", O.uid, O."isActive",
			O."imageURl" offerImage,
			U.profession, U."imageURl" userImage, U."fullName",
			(select count(uid) from offers_favorites OFS where  OFS."offerId" = O."offerId") as favoriterCount,
			(select count(uid) from offers_favorites OFS1 where  OFS1."offerId" = O."offerId" AND uid =  $1) as isFavorites
			FROM offers O
			INNER JOIN users U ON U.uid = O.uid
			WHERE O."offerId" = $1`, [id]);
		const data = result.rows[0];
		if (result.rowCount > 0) {
			return data;
		} else {
			return null;
		}
	},

	remove: async (id, client) => {
		const result = await client.query(`UPDATE offers SET "isActive" = $1  WHERE "offerId" = $2`, [false, id]);
		if (result.rowCount > 0) {
			return { error: false, removedOfferId: id, message: 'Offer removed successfully' };
		} else {
			return { error: true, message: "Offer removed failed" };
		}
	},

	updateHashTags: async (Obj, client) => {
		const { reqObj, offerId } = Obj;
		var result = false;
		await client.query(`DELETE FROM "offers_hashTags" WHERE "offerId" = $1`, [offerId]);
		await JSON.parse(reqObj.hashTags).map(item => {
			client.query(`INSERT INTO "offers_hashTags"("offerId", "hashTag") VALUES ($1, $2)`, [offerId, item]);
			result = true;
		});
		return { error: false, message: 'Data update successfully' };
	},

	saveFavorites: async (reqObj, client) => {
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
	},

	saveReport: async (reqObj, client) => {
		const result = await client.query(`INSERT INTO offers_reports("offerId", "reporterUId",comment)
		VALUES ($1, $2, $3)`, [reqObj.offerId, reqObj.reporterUId, reqObj.comment]);

		if (result.rowCount > 0) {
			return { error: false, message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data saved failed" };
		}
	}
};
