
var self = module.exports = {
	create: async (reqObj, client) => {
		try {
			const result = await client.query(`INSERT INTO "users_countryCurrency"(uid, amount, "oppPersonBalance", currency, label, value, "balanceData")
			VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING "uid"`,
			[reqObj.uid, reqObj.amount, reqObj.oppPersonBalance, reqObj.currency, reqObj.label, reqObj.value, reqObj.balanceData]);
			if (result.rowCount > 0) {
				return { error: false, message: 'Data saved successfully' };
			} else {
				return { error: true, message: "Data save failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString()};
		}
	},

	update: async (Obj, client) => {
		try {
			const { reqObj, uid } = Obj;
			const result = await client.query(`UPDATE "users_countryCurrency"
				SET amount=$3, "oppPersonBalance"=$4, "balanceData"=$5
				WHERE "uid"= $1  AND currency = $2`, [uid, reqObj.currency, reqObj.amount, reqObj.oppPersonBalance, reqObj.balanceData]);
			let data = [];
			if (result.rowCount > 0) {
				const result1 = await module.exports.getUserCountryCurrency(result.rows[0].uid, client);
				data = result1 ? result1 : null;
				return { error: false, data, message: 'Data updated successfully' };
			} else {
				return { error: true, data, message: "Data updated failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},

	getUserCountryCurrency: async (id, client) => {
		try {
			const result = await client.query(`SELECT
				amount, "oppPersonBalance", currency, label, value, "balanceData"
				FROM "users_countryCurrency" UCC
				INNER JOIN users U ON U.uid = UCC."uid"
				WHERE UCC.uid = $1`, [id]);

			const data = result.rows;
			if (result.rowCount > 0) {
				return { error: false, data, message: 'get users Country Currency data successfully'};
			} else {
				return { error: false, data:[], message: "get users Country Currency data failed"};
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},
	checkUserCountryCurrency: async (id, currency, client) => {
		try {
			const result = await client.query(`SELECT
				amount, "oppPersonBalance", currency, label, value, "balanceData"
				FROM "users_countryCurrency" UCC
				INNER JOIN users U ON U.uid = UCC."uid"
				WHERE UCC.uid = $1 AND UCC.currency= $2`, [id, currency]);

			if (result.rowCount > 0) {
				return { error: false, available: true, message: 'get users Country Currency data successfully'};
			} else {
				return { error: false, available: false, message: "get users Country Currency data failed"};
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},
	remove: async (reqObj, client) => {
		try {
			const result = await client.query(`DELETE FROM public."users_countryCurrency"
				WHERE "uid"= $1  AND currency = $2`, [reqObj.uid, reqObj.currency]);
			if (result.rowCount > 0) {
				return { error: false, message: 'Deleted data successfully'};
			} else {
				return { error: false, message: "Deleted data failed"};
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},
	bulkInsert: async (reqObj, client) => {
		try {
			var result = null;
			await Promise.all(reqObj.countryCurrency.map(async item => {
				if (item.amount){
					const checkExiting = await self.checkUserCountryCurrency(reqObj.uid, item.currency, client);
					if (!checkExiting.error) {
						if (checkExiting.available) {
							const tempObj = { reqObj:item, uid: reqObj.uid}
							await self.update(tempObj, client);
						} else {
							const saveData = { ...item, uid: reqObj.uid };
							await self.create(saveData, client);
						}
					} else {
						return { error: true, message: error.toString() };
					}
				} else {
					await self.remove({ uid: reqObj.uid, currency: item.currency }, client);
				}
				result = true;
			}));
			if (result){
				return { error: false, message: 'Updated data successfully' };
			}
		} catch (err) {
			console.log('err', err)
			return { error: true, message: err.toString() };
		}
	},
};
