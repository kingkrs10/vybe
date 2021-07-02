const { v4: uuidv4 } = require('uuid');
module.exports = {
	create: async (reqObj, client) => {
		try {
			const messageId = uuidv4();
			const result = await client.query(`INSERT INTO messages("messageId", "chatId", message, "messageFromUId", "messageToUId", "messageType")
					VALUES($1, $2, $3, $4, $5, $6 )  RETURNING "messageId"`,
				[messageId, reqObj.chatId, reqObj.message, reqObj.messageFromUId, reqObj.messageToUId, reqObj.messageType]);
			let data = null;
			if (result.rowCount > 0) {
				const result1 = await module.exports.getOne(result.rows[0].messageId, client);
				data = result1.data ? result1.data : null;
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

	updateUnRead: async (id, client) => {
		try{
			const result = await client.query(`UPDATE messages SET
			"unreadMessage" = $2, "updatedAt" = now()
			WHERE "messageId" = $1 RETURNING "messageId"`,
			[id, false]);
			if (result.rowCount > 0) {
				return { error: false, data, message: 'UnRead message flag update successfully' };
			} else {
				return { error: true, message: "UnRead message flag  update failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	update: async (Obj, client) => {
		try {
			const { reqObj, messageId } = Obj;
			const result = await client.query(`UPDATE messages SET
			"message" = $2, "updatedAt" = now()
			WHERE "messageId" = $1 RETURNING "messageId"`,
				[messageId, Obj.message]);
			if (result.rowCount > 0) {
				return { error: false, data, message: 'Data update successfully' };
			} else {
				return { error: true, message: "Data update failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getAll: async (chatId, client) => {
		try {
			const result = await client.query(`SELECT "messageId", "chatId", message, "messageFromUId", "messageToUid", "messageType", "unreadMessage",
				U."fullName" as messageFromName, U."imageURl" as messageFromURI,
				U1."fullName" as messageToName, U1."imageURl" as messageToURI
				FROM messages Msg
				INNER JOIN users U ON U.uid = Msg."messageFromUId"
				INNER JOIN users U1 ON U1.uid = Msg."messageToUid"
				INNER JOIN chats Ch ON Ch."chatId" = Msg."chats"
				WHERE Msg."chatId" =  $1
				WHERE Msg."isActive" =  $2
				AND Ch."isActive" =  $2
				ORDER BY Msg."createdAt" DESC
				`, [chatId, true ]);
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

	getOne: async (id, client) => {
		try {
			const result = await client.query(`SELECT "messageId", Msg."chatId" MsgChatId, message, Msg."messageFromUId", Msg."messageToUId", "messageType", "unreadMessage",
				U."fullName" as messageFromName, U."imageURl" as messageFromURI,
				U1."fullName" as messageToName, U1."imageURl" as messageToURI
				FROM messages Msg
				INNER JOIN users U ON U.uid = Msg."messageFromUId"
				INNER JOIN users U1 ON U1.uid = Msg."messageToUId"
				INNER JOIN chats Ch ON Ch."chatId" = Msg."chatId"
				WHERE Msg."messageId" = $1`, [id]);
			const data = result.rows[0];

			if (result.rowCount > 0 && data) {
				return { error: false, data, message: 'Get data successfully' };
			} else {
				return { error: true, data: null, message: "Get data failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	remove: async (id, client) => {
		try {
			const result = await client.query(`UPDATE messages SET "isActive" = $1  WHERE "messageId" = $2`, [false, id]);
			if (result.rowCount > 0) {
				return { error: false, removedUserId: id, message: 'Message removed successfully' };
			} else {
				return { error: true, message: "Message removed failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	}
};
