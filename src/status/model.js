module.exports = {
   getAll: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
         "statusId", "statusName", "isActive", "createdAt"
         FROM status
         `)
         if(result.rowCount > 0){
            return { error: false, data: result.rows, message: 'Read Successfully'}
         } else{
            return { error: true, message: 'Read failed'}
         }
      } catch(error){
         return{ error: true, message:error.toString()}
      }
   }
}