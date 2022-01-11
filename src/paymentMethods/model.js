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

         return { error: false, data: result.rows || [], message: 'Read Successfully'}
      } catch(error){
         console.log('error',error);
         return{ error: true, message:error.toString()}
      }
   }
}