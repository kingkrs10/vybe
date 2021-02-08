const { v4: uuidv4 } = require('uuid');

module.exports = {
	create: async (reqObj, client) => {
		const chatId = uuidv4();
		const result = await client.query(`INSERT INTO chats("chatId", "lastMessage", "messageFromUId", "messageToUId")
				VALUES($1, $2, $3, $4 )  RETURNING "chatId"`,
			[chatId, reqObj.message, reqObj.messageFromUId, reqObj.messageToUId]);
		let data = null;
		if (result.rowCount > 0) {
			const result1 = await module.exports.getOne(result.rows[0].chatId, client);
			data = result1 ? result1 : null;
		}
		if (result.rowCount > 0 && data) {
			return { error: false, data, message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data save failed" };
		}
	},

	update: async (Obj, client) => {
		const { reqObj, chatId } = Obj;
		const result = await client.query(`UPDATE offers SET
			"lastMessage" = $2, "messageFromUId" = $3, messageToUId = $4, "lastModified" = now()
			WHERE "chatId" = $1 RETURNING "chatId"`,
			[chatId, reqObj.headLine, reqObj.messageFromUId, reqObj.messageToUId]);
		let data = null;
		if (result.rowCount > 0) {
			const result1 = await module.exports.getOne(result.rows[0].chatId, client);
			data = result1 ? result1 : null;
		}
		if (result.rowCount > 0) {
			return { error: false, data, message: 'Data update successfully' };
		} else {
			return { error: true, message: "Data update failed" };
		}
	},

	getAll: async (reqObj, client) => {
		// const limit = 5
		// const pageNo = parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1
		const result = await client.query(`SELECT "chatId", "lastMessage", "messageFromUId", "messageToUId", "lastModified",ch."isActive",
			U."fullName" as messageFromName, U."imageURl" as messageFromURI,
			U1."fullName" as messageToName, U1."imageURl" as messageToURI
			FROM chats Ch
			INNER JOIN users U ON U.uid = ch."messageFromUId"
			INNER JOIN users U1 ON U1.uid = ch."messageToUId"
			WHERE Ch."isActive" =  $2
			AND U."isActive" =  $2
			AND Ch."messageFromUId" not in (select "blockedUserId" from "users_blockedUsers" WHERE uid =  $1)
			AND Ch."messageToUId" not in (select "blockedUserId" from "users_blockedUsers" WHERE uid =  $1)
			AND (Ch."messageFromUId" = $1 OR ch."messageToUId" = $1)
			ORDER BY Ch."createdAt" DESC`, [reqObj.uid, true]);
		const data = result.rows;
		if (result.rowCount > 0) {
			return { error: false, data, message: 'get all data successfully' };
		} else {
			return { error: true, message: "get all data failed" };
		}
	},

	getOne: async (id, client) => {
		const result = await client.query(`SELECT "chatId", "lastMessage", "messageFromUId", "messageToUId", "lastModified", Ch."isActive",
			U."fullName" as messageFromName, U."imageURl" as messageFromURI,
			U1."fullName" as messageToName, U1."imageURl" as messageToURI
			FROM chats Ch
			INNER JOIN users U ON U.uid = Ch."messageFromUId"
			INNER JOIN users U1 ON U1.uid = Ch."messageToUId"
			WHERE Ch."chatId" = $1`, [id]);
		const data = result.rows[0];
		if (result.rowCount > 0) {
			return data;
		} else {
			return null;
		}
	},

	remove: async (id, client) => {
		const result = await client.query(`UPDATE chats SET "isActive" = $1  WHERE "chatId" = $2`, [false, id]);
		if (result.rowCount > 0) {
			return { error: false, removedUserId: id, message: 'chat removed successfully' };
		} else {
			return { error: true, message: "Chat removed failed" };
		}
	}
};
