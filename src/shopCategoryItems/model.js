const { v4: uuidv4 } = require("uuid");

module.exports = {
   create: async (reqObj , client) => {
      const shopCategoryItemId = uuidv4();
      try{
         const result = await client.query(`INSERT INTO "shop_categoryItems"(
         "shopCategoryItemId",
         "shopId",
         "categoryItemId"
         )
         VALUES($1, $2, $3)`,
         [
            shopCategoryItemId,
            reqObj.shopId,
            reqObj.categoryItemId
         ])
         return { error: false, messsge: 'Created successfully'}
      } catch (error){
         return { error: true, messsge: error.toString()}
      }
    },

   getOne: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
         SCI."categoryItemId", CI."categoryName"
         FROM "shop_categoryItems"  SCI
         INNER JOIN "categories"  CI ON CI."categoryId" = SCI."categoryItemId"
         WHERE SCI."shopId" = $1`,
         [reqObj.id])
         return { error: false, data: result.rows, messsge: 'Read successfully'}

       } catch (error){
         return { error: true, messsge: error.toString()}
       }
   },

   remove: async (reqObj, client) => {
      try{
         const result = await client.query(`DELETE FROM "shop_categoryItems"
         WHERE "shopId" = $1`,
         [reqObj.shopId])
         return { error: false, data: result.rows, messsge: 'Delete Successfully'}
       } catch (error){
         return { error: true, messsge: error.toString()}
       }
   },

   updateInactive: async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE "shop_categoryItems" SET
         "isActive" = $2
         WHERE "shopId" = $1`,
         [reqObj.shopId, false])

         return { error: false, messsge: 'Updated successfully'}

      } catch (error){
         return { error: true, messsge: error.toString()}
      }
   },
}