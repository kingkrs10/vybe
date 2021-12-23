const shopMembersModel = require("../shopMembers/model");
const shopCategoryItems = require("../shopCategoryItems/model");
module.exports = {
   create: async (reqObj,client) =>{
      try{
         const result = await client.query(
            `INSERT INTO shops(
               "shopId",
               "shopName",
               "shopDescription",
               "shopShortDescription",
               "locationName",
               "latitude",
               "longitude",
               "shopImageURL",
               "shopThumpImageURL",
               "shopMediumImageURL",
               "socialMedia",
               "shipping_processing_time",
               "shipping_customs_and_import_taxes"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING "shopId"`,
            [
               reqObj.shopId,
               reqObj.shopName,
               reqObj.shopDescription,
               reqObj.shopShortDescription,
               reqObj.locationName,
               reqObj.latitude,
               reqObj.longitude,
               reqObj.shopImageURL,
               reqObj.shopThumpImageURL,
               reqObj.shopMediumImageURL,
               reqObj.socialMedia,
               reqObj.shipping_processing_time,
               reqObj.shipping_customs_and_import_taxes
            ]
         )
         let success = true;
         let errorMsg = null;

         if (result.rowCount > 0){
            await Promise.all(reqObj.shopMembers.map( async (item) =>{
               try {
                  await shopMembersModel.create({...item, shopId:reqObj.shopId},client);
               } catch (error) {
                  errorMsg = error.toString();
                  success = false;
               }
            }));

            await Promise.all(reqObj.categoryItem.map( async (item) =>{
               try {
                  await shopCategoryItems.create({...item, shopId:reqObj.shopId}, client);
               } catch (error) {
                  errorMsg = error.toString();
                  success = false;
               }
            }));
         } else {
            errorMsg = 'Data saved failed';
            success = false;
         }

         if(success && !errorMsg){
            return {error: false, message: 'Data saved successfully'};
         } else{
            return {error: true , message: 'Data saved failed'};
         }
      } catch (error) {
         return { error: true, message: error.toString() };
      }
   },

   update: async (reqObj,client) => {
      try{
         const result = await client.query( `UPDATE shops SET
            "shopName" = $1,
            "shopDescription" = $2,
            "shopShortDescription" = $3,
            "locationName" = $4,
            "latitude" = $5,
            "longitude" = $6,
            "shopImageURL" = $7,
            "shopThumpImageURL" = $8,
            "shopMediumImageURL" = $9,
            "socialMedia" = $10,
            "shipping_processing_time" = $11,
            "shipping_customs_and_import_taxes" = $12,
            "updatedAt" = now()
            WHERE "shopId" = $13
            RETURNING "shopId"
         `,
         [
            reqObj.shopName,
            reqObj.shopDescription,
            reqObj.shopShortDescription,
            reqObj.locationName,
            reqObj.latitude,
            reqObj.longitude,
            reqObj.shopImageURL,
            reqObj.shopThumpImageURL,
            reqObj.shopMediumImageURL,
            reqObj.socialMedia,
            reqObj.shipping_processing_time,
            reqObj.shipping_customs_and_import_taxes,
            reqObj.shopID
         ])
         let success = true;
         let errorMsg = null;
         if (result.rowCount > 0){
            await shopMembersModel.remove({ shopId:reqObj.shopId},client);

            await Promise.all(reqObj.shopMembers.map( async (item) =>{
               try {
                  await shopMembersModel.create({...item, shopId:reqObj.shopId},client);
               } catch (error) {
                  errorMsg = error.toString();
                  success = false;
               }
            }));

            await shopCategoryItems.remove({ shopId:reqObj.shopId},client);

            await Promise.all(reqObj.categoryItem.map( async (item) =>{
               try {
                  await shopCategoryItems.create({...item, shopId:reqObj.shopId}, client);
               } catch (error) {
                  errorMsg = error.toString();
                  success = false;
               }
            }));
         } else {
            errorMsg = 'Data saved failed error';
            success = false;
         }
         console.log('errorMsg',errorMsg);
         if(success && !errorMsg){
            return {error: false, message: 'Data saved successfully'};
         } else{
            return {error: true , message: 'Data saved failed 23'};
         }
      } catch (error) {
         console.log('err', error);
         return { error: true,message: error.toString() };
      }
   },

   getOne: async (reqObj ,client) => {
      try{
         const result = await client.query(`SELECT
         "shopId","shopName","shopDescription","shopShortDescription","locationName",
         "latitude","longitude","shopImageURL","shopThumpImageURL","shopMediumImageURL",
         "socialMedia","shipping_processing_time","shipping_processing_time",
         "isActive","createdAt","updatedAt"
         FROM shops
         WHERE "shopId" = $1
         `,[reqObj.id]);

         return {error: false, data: result.rows}
      } catch (error){
         return { error: true, message: error.toString()}
      }
   },

   getAll: async (reqObj ,client) => {
      try{
         var queryText = `SELECT
         "shopId","shopName","shopDescription","shopShortDescription","locationName",
         "latitude","longitude","shopImageURL","shopThumpImageURL","shopMediumImageURL",
         "socialMedia","shipping_processing_time","shipping_processing_time",
         "isActive","createdAt", "updatedAt"
         FROM shops
         WHERE "isActive" = $1`
         const result = await client.query(`${queryText}`,[true])
         if(result.rowCount > 0){
            return {error: false, data: result.rows, message:'Read successfully'}
         } else{
            return { error: true, message: 'Read failed'}
         }
      } catch (error){
         return { error : true,  message : error.toString()}
      }
   },

   remove: async (reqObj ,client) => {
      try{
         const result = await client.query(
            `UPDATE shops SET "isActive" = $1 WHERE "shopId"= $2` , [false, reqObj.id]
         )
         if(result.rowCount > 0) {
            await shopMembersModel.updateInactive({ shopId:reqObj.id},client);
            await shopCategoryItems.updateInactive({ shopId:reqObj.id},client);

            return {error: false, message: 'Deleted successfully'}
         } else{
            return {error: true, message : 'Deleted failed'}
         }
      } catch (error){
         return { error: true, message: error.toString()}
      }
   }
}

