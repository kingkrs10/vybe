module.exports = {
   create: async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO "shippingAddresses"
         (
            "addressId",
            "firstName",
            "lastName",
            "streetAddress",
            "floorUnit",
            "country",
            "state",
            "city",
            "pincode",
            "phoneNumber",
            "userId"
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         RETURNING *`,
         [
           reqObj.addressId,
           reqObj.firstName,
           reqObj.lastName,
           reqObj.streetAddress,
           reqObj.floorUnit,
           reqObj.country,
           reqObj.state,
           reqObj.city,
           reqObj.pincode,
           reqObj.phoneNumber,
           reqObj.userId
         ])
         return {error: false, message: 'Data saved suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   update: async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE "shippingAddresses" SET
            "firstName" = $2,
            "lastName" = $3,
            "streetAddress" = $4,
            "floorUnit" = $5,
            "country" = $6,
            "state" = $7,
            "city" = $8,
            "pincode" = $9,
            "phoneNumber" = $10
            WHERE "addressId" = $1`,
         [
           reqObj.addressId,
           reqObj.firstName,
           reqObj.lastName,
           reqObj.streetAddress,
           reqObj.floorUnit,
           reqObj.country,
           reqObj.state,
           reqObj.city,
           reqObj.pincode,
           reqObj.phoneNumber
         ])
         return {error: false, message: 'Data updated suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   getAll: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT "addressId","firstName","lastName",
         "streetAddress","floorUnit", "country", "state", "city", "pincode", "phoneNumber", "userId", "isDefault", "isActive","createdAt","updatedAt"
         FROM "shippingAddresses"
         WHERE "userId" = $1
         AND "isActive" = $2`,
         [reqObj.userId,true])
         return {error: false, data: result.rows, message: 'Data read suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   getOne: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT "addressId", "firstName", "lastName",
         "streetAddress", "floorUnit", "country", "state", "city", "pincode", "phoneNumber", "userId", "isDefault", "isActive", "createdAt", "updatedAt"
         FROM "shippingAddresses"
         WHERE "addressId" = $1`,
         [reqObj.addressId])
         return {error: false, data: result.rows, message: 'Data read suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   remove: async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE "shippingAddresses" SET 
         "isActive" = $1 WHERE "addressId" = $2`,
         [false,reqObj.addressId])
         return {error: false, data: result.rows, message: 'Data deleted suceessfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   }
}
