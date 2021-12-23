const { v4: uuidv4 } = require("uuid");
module.exports = {
   getAllCategories: async (reqObj , client) => {
		try {
			const result = await client.query(`SELECT
				"categoryId", "categoryName"
				FROM categories
				WHERE "isActive" = $1`, [true]);
			const data = result.rows;
			if (result.rowCount > 0) {
				return {error: false, data};
			} else {
				return { error: false, data:[]};
			}
		} catch (error) {
			return { error: true, message: error.toString() };
		}
   },

   getShopCategoryItems: async (reqObj , client) => {
      try {
			const result = await client.query(`SELECT
            CI."categoryItemId", CI."categoryId", CI."categoryItemName", CI."groupName",
            Cat."categoryName"
            FROM "categoryItems" CI
            INNER JOIN categories Cat ON Cat."categoryId" = CI."categoryId"
            WHERE Cat."categoryName" = $1
				AND Cat."isActive" = $2
            AND CI."isActive" = $2`, ['Shop', true]);
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