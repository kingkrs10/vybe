module.exports = {
   create : async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO "shop_collections"(
            "shopCollectionId", "shopId",
            "collectionName", "collectionDescription"
         ) VALUES($1, $2, $3, $4)`,
         [ reqObj.shopCollectionId, reqObj.shopId, reqObj.collectionName, reqObj.collectionDescription ]);

         return { error: false, message: 'Created successfully'}
      } catch (error){
         return { error: true, message: error.toString()}
      }
   },

   update: async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE shop_collections SET
         "collectionName" = $1,
         "collectionDescription" = $2,
         "updatedAt" = now()
         WHERE "shopCollectionId" = $3`,
         [
            reqObj.collectionName,
            reqObj.collectionDescription,
            reqObj.id
         ]);
         return { error: false, message: 'Updated successfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   getAll:  async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
            "shopCollectionId", "shopId", "collectionName", "collectionDescription", "isActive", "createdAt", "updatedAt"
         FROM shop_collections
         WHERE "isActive" = $1`,
         [true])

         if(result.rowCount > 0){
            return {error: false, data: result.rows, message: 'Read successfully'}
         } else{
            return {error: false, message: 'Read falied'}
         }
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   getOne : async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
            "shopCollectionId", "shopId", "collectionName", "collectionDescription", "isActive"
         FROM "shop_collections"
         WHERE "shopCollectionId" = $1`,
         [reqObj.id])

         return {error: false, data: result.rows, message: 'Read successfully'}
      } catch(error) {
         return {error: false, message: error.tostring()}
      }
   },

   remove : async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE shop_collections SET
         "isActive" = $1 WHERE "shopCollectionId" = $2`,
         [false,reqObj.id])
         return {error: false, message: 'Deleted Successfully'}
      } catch(error) {
         return {error: false, message: error.toString()}
      }
   }
}