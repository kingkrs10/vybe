const shopMembersModel = require("../shopMembers/model");
const shopCategoryItems = require("../shopCategoryItems/model");
module.exports = {
   create: async (reqObj,client) =>{
      try{
         const result = await client.query(
            `INSERT INTO shops(
               "shopId",
               "shopName",
               "userId"
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            RETURNING "shopId"`,
            [
               reqObj.shopId,
               reqObj.shopName,
               reqObj.userId,
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
            "userId" = $2
            "shopDescription" = $3,
            "shopShortDescription" = $4,
            "locationName" = $5,
            "latitude" = $6,
            "longitude" = $7,
            "shopImageURL" = $8,
            "shopThumpImageURL" = $9,
            "shopMediumImageURL" = $10,
            "socialMedia" = $11,
            "shipping_processing_time" = $12,
            "shipping_customs_and_import_taxes" = $13,
            "updatedAt" = now()
            WHERE "shopId" = $14
            RETURNING "shopId"
         `,
         [
            reqObj.shopName,
            reqObj.userId,
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
            await shopMembersModel.remove({ shopId:reqObj.shopID},client);

            await Promise.all(reqObj.shopMembers.map( async (item) =>{
               try {
                  await shopMembersModel.create({...item, shopId:reqObj.shopID},client);
               } catch (error) {
                  errorMsg = error.toString();
                  success = false;
               }
            }));

            await shopCategoryItems.remove({ shopId:reqObj.shopID},client);

            await Promise.all(reqObj.categoryItem.map( async (item) =>{
               try {
                  await shopCategoryItems.create({...item, shopId:reqObj.shopID}, client);
               } catch (error) {
                  errorMsg = error.toString();
                  success = false;
               }
            }));
         } else {
            errorMsg = 'Data saved failed error';
            success = false;
         }

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
         "shopId","shopName","userId", "shopDescription","shopShortDescription","locationName",
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
         var queryText = `SELECT * FROM (SELECT
            S."shopId","shopName", "userId", "shopDescription","shopShortDescription","locationName",
            "latitude","longitude","shopImageURL","shopThumpImageURL","shopMediumImageURL",
            C."categoryId", C."categoryName", S."isActive",
            ( 3959 * acos( cos( radians($2) ) * cos( radians( S.latitude ) ) * cos( radians( S.longitude ) - radians($3) ) + sin( radians($2) ) * sin( radians( S.latitude) ) ) ) AS distance
            FROM shops AS S
            INNER JOIN "shop_categoryItems" AS SCI ON SCI."shopId" = S."shopId"
			INNER JOIN  categories C ON C."categoryId" = SCI."categoryItemId") AS tbl
         WHERE "isActive" = $1`
         var qryValue = [true,  reqObj.latitude, reqObj.longitude]

         if(reqObj.isNearby){
            queryText += ` AND distance < $4`
            qryValue = [true,  reqObj.latitude, reqObj.longitude, 100]
         }
         const result = await client.query(`${queryText}`, qryValue);

         return {error: false, data: result.rows, message:'Read successfully'}
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
   },


}

