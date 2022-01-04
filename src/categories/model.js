module.exports = {
   getAllCategories: async (reqObj , client) => {
		try {
			const result = await client.query(`SELECT
				"categoryId", "parentId", "categoryName", M."menuName"
			FROM public.categories AS C
			INNER JOIN menus M ON M."menuId" = C."parentId" AND M."isActive" =$1
			WHERE C."isActive" = $1`, [true]);
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

	getCategoryItems: async (reqObj , client) => {
		try {
				const result = await client.query(`SELECT
					C."categoryId", C."categoryName",
					M."menuId", M."menuName"
				FROM public.categories AS C
				INNER JOIN menus M ON M."menuId" = C."parentId"
				WHERE C."isActive" = $1
				AND M."isActive" = $1
				AND M."keyCode" = $2`, [true, reqObj.keyCode]);

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

   	getSubCategoryItems: async (reqObj , client) => {
      	try {
			const result = await client.query(`SELECT
				C."categoryId", C."categoryName",
				M."menuId", M."menuName",
				CI."categoryItemId", CI."categoryItemName"
				FROM public.categories AS C
			INNER JOIN menus M ON M."menuId" = C."parentId"
			INNER JOIN "categoryItems" CI ON CI."categoryId" = C."categoryId"
			WHERE C."isActive" = $1
			AND CI."isActive" = $1
			AND CI."categoryId" = ANY($2 ::uuid[])`, [true, reqObj.categoryId]);

			const data = result.rowCount > 0 ? result.rows: [];
			return {error: false, data};
		} catch (error) {
			return { error: true, message: error.toString() };
		}
   	}
}