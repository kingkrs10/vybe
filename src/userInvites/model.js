module.exports = {
	create: async (reqObj, client) => {
		const result = await client.query(`INSERT INTO users_invites("senderUId", "receiverPhoneNumber", status)
		VALUES($1, $2, $3) RETURNING "senderUId"`, [reqObj.senderUId, reqObj.receiverPhoneNumber, '0']);
		if (result.rowCount > 0) {
			return { error: false, message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data save failed" };
		}
	},

	update: async (Obj, client) => {
		const { reqObj, uid } = Obj;
		const result = await client.query(`UPDATE users_invites
		SET "receiverUId" = $1, status=$4
		WHERE "senderUId"= $2  AND "receiverPhoneNumber" = $3`, [uid, reqObj.senderUId, reqObj.receiverPhoneNumber,'1']);
		if (result.rowCount > 0) {
			// await client.query(`DELETE FROM users_invites WHERE "receiverPhoneNumber"= $1, AND "senderUId" <> $1 AND "receiverUId" = $1)`, [reqObj.senderUId, reqObj.receiverPhoneNumber,'']);
			return { error: false, message: 'Data saved successfully' };
		} else {
			return { error: true, message: "Data save failed" };
		}
	},

	getUserInvites: async (id, client) => {
		const result = await client.query(`SELECT
			"senderUId", "receiverUId", "receiverPhoneNumber", status
			FROM public.users_invites UI
			INNER JOIN users U ON U.uid = UI."senderUId"
		WHERE "receiverUId" = $1`, [id]);
		const data = result.rows;
		if (result.rowCount > 0) {
			return { error: false, data, message: 'get users invites data successfully' };
		} else {
			return { error: true, message: "get users invites data failed" };
		}
	}
};
