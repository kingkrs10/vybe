module.exports = {
   create: async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO "products"
         (
            "productId",
            "productName",
            "productDescription",
            "productPrice",
            "productDiscount",
            "productTotalQty",
            "productSoldQty",
            "productDamageQty",
            "productImageURL",
            "productThumpImageURL",
            "productMediumImageURL",
            "productCategoryItemId",
            "productShopId" ,
            "productCollectionIds",
            "productCurrency",
            "productOptions"
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
         RETURNING "productId"`,
         [
            reqObj.productId,
            reqObj.productName,
            reqObj.productDescription,
            reqObj.productPrice,
            reqObj.productDiscount,
            reqObj.productTotalQty,
            reqObj.productSoldQty,
            reqObj.productDamageQty,
            reqObj.productImageURL,
            reqObj.productThumpImageURL,
            reqObj.productMediumImageURL,
            reqObj.productCategoryItemId,
            reqObj.productShopId,
            reqObj.productCollectionIds,
            reqObj.productCurrency,
            reqObj.productOptions
         ])
         return {error: false, message: 'Data saved suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   update: async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE "products" SET
            "productName" = $1,
            "productDescription" = $2,
            "productPrice" = $3,
            "productDiscount" = $4,
            "productTotalQty" = $5,
            "productSoldQty" = $6,
            "productDamageQty" = $7,
            "productImageURL" = $8,
            "productThumpImageURL" = $9,
            "productMediumImageURL" = $10,
            "productCategoryItemId" = $11,
            "productCollectionIds" = $12,
            "productOptions" = $13,
            "updatedAt" = now()
            WHERE "productId" = $14`,
         [
            reqObj.productName,
            reqObj.productDescription,
            reqObj.productPrice,
            reqObj.productDiscount,
            reqObj.productTotalQty,
            reqObj.productSoldQty,
            reqObj.productDamageQty,
            reqObj.productImageURL,
            reqObj.productThumpImageURL,
            reqObj.productMediumImageURL,
            reqObj.productCategoryItemId,
            reqObj.productCollectionIds,
            reqObj.productOptions,
            reqObj.productId
         ])
         return {error: false, message: 'Updated suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   getAll : async (reqObj ,client) => {
      try{
         const result = await client.query(`SELECT
         "productId", "productName", "productDescription", "productPrice",
         "productDiscount", "productTotalQty", "productSoldQty", "productDamageQty",
         "productImageURL", "productThumpImageURL", "productMediumImageURL",
         "productCategoryItemId", "productShopId","productCollectionIds","productOptions",
         "createdAt","updatedAt","isActive"
         FROM "products"
         WHERE "isActive" =$1`,
         [true])
         return {error: false , data: result.rows , message: 'Read successfully'}
      } catch (error) {
         return {error: true , message: error.toString()}
      }
   },

   getOne : async (reqObj ,client) => {
      try{
         const result = await client.query(`SELECT
         "productId", "productName", "productDescription", "productPrice",
         "productDiscount", "productTotalQty", "productSoldQty", "productDamageQty",
         "productImageURL", "productThumpImageURL", "productMediumImageURL",
         "productCategoryItemId", "productShopId","productCollectionIds","productOptions",
         "createdAt","updatedAt","isActive"
         FROM "products"
         WHERE "productId" =$1`,
         [reqObj.id])
         return {error: false , data: result.rows, message: 'Read successfully'}

      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   remove : async (reqObj ,client) => {
      try{
         const result = await client.query(`UPDATE "products" SET
         "isActive" = $1
         WHERE "productId"=$2`,
         [false, reqObj.id])
         if(result.rowCount > 0){
            return {error: false , message: 'Deleted successfully'}
         } else {
            return {error: true , message:'Deleted failed'}
         }
      } catch(error){
         return {error: true, message: error.toString()}
      }
   }
}