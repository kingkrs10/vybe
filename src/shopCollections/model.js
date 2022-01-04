module.exports = {
   create : async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO "shopCollections"(
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
         const result = await client.query(`UPDATE shopCollections SET
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
         var qryText = `SELECT
            "shopCollectionId", "shopId", "collectionName", "collectionDescription", "isActive"
         FROM shopCollections
         WHERE "isActive" = $1`;
         var qryValues = [true];

         if(reqObj.shopId){
            qryText = qryText + ` AND "shopId" = $2`;
           qryValue = [true, reqObj.shopId];
         }

         const result = await client.query(qryText, qryValue)

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
         FROM "shopCollections"
         WHERE "shopCollectionId" = $1`,
         [reqObj.id])

         return {error: false, data: result.rows, message: 'Read successfully'}
      } catch(error) {
         return {error: false, message: error.tostring()}
      }
   },

   remove : async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE shopCollections SET
         "isActive" = $1 WHERE "shopCollectionId" = $2`,
         [false,reqObj.id])
         return {error: false, message: 'Deleted Successfully'}
      } catch(error) {
         return {error: false, message: error.toString()}
      }
   }
}