module.exports = {
   getAll: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
         "paymentMethodId" ,
         "paymentMethodName",
         "isActive",
         "createdAt"
         FROM "paymentMethods"
         `)
         console.log('resultData',result);
         if(result.rowCount > 0){
            return { error: false, data: result.rows, message: 'Read Successfully'}
         } else{
            return { error: true, message: 'Read failed'}
         }
      } catch(error){
         console.log('error',error);
         return{ error: true, message:error.toString()}
      }
   }
}