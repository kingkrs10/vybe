module.exports = {
   getAll: async (reqObj , client) => {
		try {
			const result = await client.query(`SELECT
				"menuId", "menuName", "keyCode", "isActive", "order"
			FROM public.menus;
			WHERE "isActive" = $1
			ORDER BY "order" ASC;`, [true]);

			const data = result.rows;
			if (result.rowCount > 0) {
				return {error: false, data};
			} else {
				return { error: false, data:[]};
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
   }
}