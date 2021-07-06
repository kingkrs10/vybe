
var self = module.exports = {
	updateCurrency: async (reqObj, client) => {
		try {
			await client.query(`DELETE FROM "currency"`);
			const result = await client.query(`INSERT INTO "currency"(id, "currencyDetails")
			VALUES($1, $2) RETURNING "id"`,
			[reqObj.id, reqObj.currencyDetails]);
			if (result.rowCount > 0) {
				return { error: false, message: 'Data saved successfully' };
			} else {
				return { error: true, message: "Data save failed" };
			}
		} catch (error) {
			return { error: true, message: error.toString()};
		}
	},

	getCurrency: async (id, client) => {
		try {
			const result = await client.query(`SELECT id, "currencyDetails" FROM "currency"`);
			const data = result.rows;
			if (result.rowCount > 0) {
				return { error: false, data, message: 'get Country Currency data successfully'};
			} else {
				return { error: false, data:[], message: "get Country Currency data failed"};
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
	},
};
