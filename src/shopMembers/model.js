const { v4: uuidv4 } = require("uuid");
module.exports = {
   create: async (reqObj , client) => {
      const shopMemberId = uuidv4();
      try{
         const result = await client.query(` INSERT INTO "shop_members"(
         "shopMemberId",
         "shopId",
         "userId",
         "designation"
         )
         VALUES($1,$2,$3,$4)`,
         [
            shopMemberId,
            reqObj.shopId,
            reqObj.userId,
            reqObj.designation
         ])
         return { error: false, messsge: 'Created successfully'}

      } catch (error){
         return { error: true, messsge: error.toString()}
      }
    },

   update: async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE "shop_members" SET
         "memberDesignation" = $1,
         "isActive" = $2
         WHERE "shopMemberId" = $3`,
         [
         reqObj.memberDesignation,
         reqObj.isActive,
         reqObj.shopMemberId
         ])
         return { error: false, messsge: 'Updated successfully'}
      } catch (error){
         return { error: true, messsge: error.toString()}
      }
   },

   updateInactive: async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE "shop_members" SET
         "isActive" = $2
         WHERE "shopId" = $1`,
         [reqObj.shopId, false])

         return { error: false, messsge: 'Updated successfully'}

      } catch (error){
         return { error: true, messsge: error.toString()}
      }
   },

   getOne: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
         SM."shopMemberId", SM."shopId", SM."userId", SM."designation",
         U."fullName", U."userImage", U."userThumpImage", U."userMediumImage", U."phoneNumber",U."firebaseUId"
         FROM "shop_members" SM
         INNER JOIN users U ON SM."userId" = U."userId"
         WHERE SM."shopId" = $1`,
         [reqObj.id])
         return { error: false, data: result.rows, messsge: 'Read successfully'}
      } catch (error){
         return { error: true, messsge: error.toString()}
      }
   },

   remove: async (reqObj, client) => {
      try{
         const result = await client.query(`DELETE from "shop_members"
         WHERE "shopId" = $1`,
         [reqObj.shopId])
         return { error: false, data: result.rows, messsge: 'Delete successfully'}
      } catch (error){
         return { error: true, messsge: error.toString()}
      }
   }
}