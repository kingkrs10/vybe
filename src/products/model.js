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
            "productCurrency" = $13,
            "productOptions" = $14
            "updatedAt" = now()
            WHERE "productId" = $15`,
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
            reqObj.productCurrency,
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
         const limit =  250;
			const pageNo = reqObj.pageNo ? parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1 : 1;
         var qryText = `SELECT
         "productId", "productName", "productDescription", "productPrice",
         "productDiscount", "productTotalQty", "productSoldQty", "productDamageQty",
         "productImageURL", "productThumpImageURL", "productMediumImageURL",
         "productCollectionIds","productCurrency" , "productOptions", P."productShopId",S."shopName",
         P."productCategoryItemId", CI."categoryItemName",
         P."createdAt", P."updatedAt", P."isActive",
         SC."collectionName", SC."shopCollectionId"
         FROM "products" as P
         INNER JOIN "categoryItems" CI ON CI."categoryItemId" =  P."productCategoryItemId"
         INNER JOIN "shops" S ON S."shopId" = P."productShopId"
         INNER JOIN "shopCollections" SC ON (SC."shopCollectionId" = ANY(P."productCollectionIds" ::uuid[]) AND SC."shopId" = P."productShopId")
         WHERE P."isActive" =$1`
         var qryValues = [true];

         if(reqObj.shopId){
            qryText += `AND  P."productShopId" = $2`;
            qryValues = [true, reqObj.shopId];
         }
         if(reqObj.collectionId){
            qryText += `AND   $3 = ANY(P."productCollectionIds" ::uuid[])`;
            qryValues = [true, reqObj.shopId, reqObj.collectionId];
         }

         if (reqObj.searchTerm && !_isEmpty(reqObj.searchTerm)) {
				queryText = `${queryText} AND (LOWER(P."productName") like LOWER($3) OR LOWER(P."productDescription") like LOWER($3))`;
				qryValue = [true, limit, `%${reqObj.searchTerm}%`];
			}

         const result = await client.query(qryText, qryValues);
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
         "productCollectionIds","productCurrency" , "productOptions", P."productShopId",S."shopName",
         P."productCategoryItemId", CI."categoryItemName",
         P."createdAt", P."updatedAt", P."isActive",
         SC."collectionName", SC."shopCollectionId"
         FROM "products" as P
         INNER JOIN "categoryItems" CI ON CI."categoryItemId" =  P."productCategoryItemId"
         INNER JOIN "shops" S ON S."shopId" = P."productShopId"
         INNER JOIN "shopCollections" SC ON (SC."shopCollectionId" = ANY(P."productCollectionIds" ::uuid[]) AND SC."shopId" = P."productShopId")
         WHERE P."productId" =$1`,
         [reqObj.id])
         return {error: false , data: result.rows, message: 'Read successfully'}

      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   productAvailabilty : async (reqObj ,client) => {
      try{
         const result = await client.query(`SELECT
         "productId", "productName",
         ("productTotalQty"-("productSoldQty"+ "productDamageQty")) as "availableProductQty",
         ("productTotalQty"-("productSoldQty"+ "productDamageQty")) > $2 as "isAvailable"
         FROM "products"
         WHERE "productId" = ANY($1 ::uuid[])`,
         [reqObj.productIds, 0])
         return {error: false , data: result.rows, message: 'read successfully'}

      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   relativeProducts : async (reqObj ,client) => {
      try{
         const limit = 50;
         const result = await client.query(`SELECT
         "productId", "productName", "productDescription", "productPrice",
         "productDiscount", "productTotalQty", "productSoldQty", "productDamageQty",
         "productImageURL", "productThumpImageURL", "productMediumImageURL",
         "productCollectionIds","productCurrency", "productOptions", P."productShopId",S."shopName",
         P."productCategoryItemId", CI."categoryItemName",
         P."createdAt", P."updatedAt", P."isActive",
         SC."collectionName", SC."shopCollectionId"
         FROM "products" as P
         INNER JOIN "categoryItems" CI ON CI."categoryItemId" =  P."productCategoryItemId"
         INNER JOIN "shops" S ON S."shopId" = P."productShopId"
         INNER JOIN "shopCollections" SC ON (SC."shopCollectionId" = ANY(P."productCollectionIds" ::uuid[]) AND SC."shopId" = P."productShopId")
         WHERE P."isActive" =$1
         AND P."productCategoryItemId" = $2
         LIMIT $3`,
         [true, reqObj.categoryItemId,limit])
         return {error: false , data: result.rows, message: 'read successfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   homepageProducts : async (reqObj ,client) => {
      // To-DO
      // Will use Union ALL for combine the Products , Services and Donation Offers
      try{
         const limit = 50;
         const pageNo = parseInt(reqObj.pageNo) === 1 ? 0 : ((parseInt(reqObj.pageNo) - 1) * limit) + 1
         const result = await client.query(`Select *  FROM (
            SELECT Pr."productId", Pr."productName", Pr."productDescription", Pr."productImageURL", 
            Pr."productThumpImageURL", Pr."productMediumImageURL", Pr."userId", Pr."isActive", 'Products' As Category
            FROM products AS Pr
            WHERE Pr."isActive" =$1
            ORDER BY Pr."createdAt" DESC
            offset $3 LIMIT $2) tbl
         `,
         [true, limit, pageNo])
         return {error: false , data: result.rows, message: 'read successfully'}
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
   },

}