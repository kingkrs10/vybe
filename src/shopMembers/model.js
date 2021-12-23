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
         if(result.rowCount > 0 && data) {
            return { error: false, messsge: 'Created successfully'}
         } else{
            return { error: true, messsge: 'Created failed'}
         }
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
         let data =null;
         if(result.rowCount > 0){
            const result1 = await module.exports.getOne({id:reqObj.shopMemberId}, client);
            data = result1 ? result1 : null;
         }
         if(result.rowCount > 0 && data) {
            return { error: false, data: data['data'], messsge: 'Updated successfully'}
         } else{
            return { error: true, messsge: 'Updated failed'}
         }
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

         if(result.rowCount > 0){
            return { error: false, data: data['data'], messsge: 'Updated successfully'}
         } else{
            return { error: true, messsge: 'Updated failed'}
         }
      } catch (error){
         return { error: true, messsge: error.toString()}
      }
   },

   getOne: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
         SM."shopMemberId", SM."shopId", SM."userId", SM."designation",
         U."fullName", U."imageURl", U."thump_imageURL", U."medium_imageURL", U."phoneNumber",U."firebaseUId"
         FROM "shop_members" SM
         INNER JOIN users U ON SM."userId" = U.uid
         WHERE SM."shopId" = $1`,
         [reqObj.id])
         if(result.rowCount > 0){
            return { error: false, data: result.rows, messsge: 'Read successfully'}
         } else{
            return { error: true, messsge: 'Read failed'}
         }
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