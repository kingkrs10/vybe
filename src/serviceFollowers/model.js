module.exports = {
   create: async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO "services_followers"
         ( "serviceId","userId")
         VALUES ($1, $2)
         RETURNING *`,
         [ reqObj.serviceId, reqObj.userId ])
         return {error: false, message: 'Data saved suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   remove: async (reqObj, client) => {
      try{
         const result = await client.query(`DELETE FROM "services_followers" 
         WHERE "serviceId" = $1 AND "userId" = $2`,
         [ reqObj.serviceId, reqObj.userId ])
         return {error: false,  message: 'Data deleted suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   }
}
