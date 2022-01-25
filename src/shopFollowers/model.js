module.exports = {
   create: async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO "shop_followers"
         ( "shopId","userId")
         VALUES ($1, $2)
         RETURNING *`,
         [ reqObj.shopId, reqObj.userId ])
         return {error: false, message: 'Data saved suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   remove: async (reqObj, client) => {
      try{
         const result = await client.query(`DELETE FROM "shop_followers" 
         WHERE "shopId" = $1 AND "userId" = $2`,
         [ reqObj.shopId, reqObj.userId ])
         return {error: false,  message: 'Data deleted suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   }
}
