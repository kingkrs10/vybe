module.exports = {
	create: async (reqObj, client) => {
		const result = await client.query(`INSERT INTO users_invites("senderId", "receiverPhoneNumber", status)
		VALUES($1, $2, $3) RETURNING "senderId"`, [reqObj.uid, reqObj.receiverPhoneNumber, '0']);
		if (result.rowCount > 0) {
			return { error: false, message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data save failed" };
		}
	},

	update: async (Obj, client) => {
		const { reqObj, uid } = Obj;
		const result = await client.query(`UPDATE users_invites SET "receiverId" = $1, status = $4
		WHERE "senderId"= $2  AND "receiverPhoneNumber" = $3`, [uid, reqObj.senderId, reqObj.receiverPhoneNumber,'1']);
		if (result.rowCount > 0) {
			// await client.query(`DELETE FROM users_invites WHERE "receiverPhoneNumber"= $1, AND "senderId" <> $1 AND "receiverId" = $1)`, [reqObj.senderId, reqObj.receiverPhoneNumber,'']);
			return { error: false, message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data save failed" };
		}
	},

	getUserInvites: async (Obj, client) => {
		const result = await client.query(`SELECT
			"senderId", "receiverId", "receiverPhoneNumber", status
			FROM public.users_invites UI
			INNER JOIN users U ON U.uid = UI."senderId"
		WHERE uid = $1`, [id]);
		const data = result.rows;
		if (result.rowCount > 0) {
			return { error: false, data, message: 'get users invites data successfully' };
		} else {
			return { error: true, message: "get users invites data failed" };
		}
	}
};
