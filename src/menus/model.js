module.exports = {
   getAll: async (reqObj , client) => {
		try {
			const result = await client.query(`SELECT
				"menuId", "menuName", "keyCode", "order"
			FROM menus
			WHERE "isActive" = $1
			ORDER BY "order" ASC;`, [true]);
			const data = result.rows || [];
			return {error: false, data};
		} catch (error) {
			return { error: true, message: error.toString() };
		}
   }
}