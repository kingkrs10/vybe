module.exports ={
   create : async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO "orderItems" (
            "orderItemId", "orderId", "productId", "productName",
            "orderItemQty", "orderItemPrice", "orderItemDiscount",
            "orderItemTotalPrice", "orderItemsproductOptions", "shopId", "userId"
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
         [
            reqObj.orderItemId,
            reqObj.orderId,
            reqObj.productId,
            reqObj.productName,
            reqObj.orderItemQty,
            reqObj.orderItemPrice,
            reqObj.orderItemDiscount,
            reqObj.orderItemTotalPrice,
            reqObj.orderItemsproductOptions,
            reqObj.shopId,
            reqObj.userId
         ])
         return{ error: false, message:'Created successfully'}

      } catch(error){
         return { error: true, message: error.toString()}
      }
   },

   update : async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE "orderItems" SET
            "orderItemQty" = $1,
            "orderItemPrice" = $2,
            "orderItemDiscount" = $3,
            "orderItemTotalPrice" = $4,
            "orderItemsproductOptions" = $5
            WHERE "orderItemId" = $6`,
         [
            reqObj.orderItemQty,
            reqObj.orderItemPrice,
            reqObj.orderItemDiscount,
            reqObj.orderItemTotalPrice,
            reqObj.orderItemsproductOptions,
            reqObj.orderItemId
         ])
         return{ error: false, message:'Updated successfully'};

      } catch(error){
         return { error: true, message: error.toString()}
      }
   },

   getCardDetails: async (reqObj, client) =>{
      try{
         const result = await client.query(`SELECT
         OI."orderItemId",OI."orderId",OI."userId",OI."productId",OI."productName",
         P."productImageURL", OI."orderItemQty",P."productPrice" as "orderItemPrice", P."productDiscount" as
         "orderItemDiscount",(P."productPrice"-P."productDiscount") * OI."orderItemQty" as "orderItemTotalPrice", OI."orderItemsproductOptions"
         FROM "orderItems" OI
         INNER JOIN "products" P ON P."productId" = OI."productId"
         WHERE OI."userId" = $1
         AND OI."orderId" IS NULL
         AND OI."isActive" = $2`,
         [reqObj.userId, true]);

         return{ error: false, data: result.rows, message:'Read successfully'};

      } catch(error){
         return{ error: true, message: error.toString()}
      }
   },

   getOne: async (reqObj, client) =>{
      try{
         const result = await client.query(`SELECT
         OI."orderItemId",OI."orderId",OI."userId",OI."productId",OI."productName",
         P."productImageURL", OI."orderItemQty",OI."orderItemPrice",OI."orderItemDiscount",
         OI."orderItemTotalPrice", OI."orderItemsproductOptions", OI."createdAt",OI."updatedAt",OI."isActive"
         FROM "orderItems" OI
         INNER JOIN "products" P ON P."productId" = OI."productId"
         WHERE OI."orderItemId" = $1
         AND OI."userId" = $2`,
         [reqObj.orderItemId, reqObj.userId]);

         return{ error: false, data: result.rows, message:'Read successfully'}

      } catch(error){
         return{ error: true, message: error.toString()}
      }
   },

   getAll: async (reqObj, client) =>{
      try{
         const result = await client.query(`SELECT
         OI."orderItemId",OI."orderId",OI."userId",OI."productId",OI."productName",
         P."productImageURL", OI."orderItemQty",OI."orderItemPrice",OI."orderItemDiscount",
         OI."orderItemTotalPrice", OI."orderItemsproductOptions", OI."createdAt",OI."updatedAt",OI."isActive"
         FROM "orderItems" OI
         INNER JOIN "products" P ON P."productId" = OI."productId"
         WHERE OI."userId" = $1
         AND OI."orderId" IS NULL
         AND OI."isActive" = $2`,
         [reqObj.userId, true]);

         return{ error: false, data: result.rows, message:'Read successfully'};

      } catch(error){
         return{ error: true, message: error.toString()}
      }
   },

   remove: async (reqObj, client) =>{
      try{
         const result = await client.query(`UPDATE "orderItems" SET
         "isActive"= $1
         WHERE "orderItemId" = ANY ($2 ::uuid[])`,
         [false, reqObj.orderItemId])
         return{ error: false, message:'Deleted successfully'}

      } catch(error){
         return{ error: true, message: error.toString()}
      }
   }
}