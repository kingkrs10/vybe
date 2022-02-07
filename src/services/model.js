module.exports = {
   create:async(reqObj, client)=>{
      try {
         const result = await client.query(`INSERT INTO services
         (
            "serviceId",
            "serviceName" ,
            "userId",
            "serviceImageURL",
            "serviceThumpImageURL" ,
            "serviceMediumImageURL" ,
            "serviceDescription",
            "categoryId" ,
            "subCategoryItemId",
            "locationName" ,
            "latitude" ,
            "longitude" ,
            "serviceStartingPrice",
            "paymentMethods"
         )
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
         [reqObj.serviceId, reqObj.serviceName, reqObj.userId, reqObj.serviceImageURL, reqObj.serviceThumpImageURL, reqObj.serviceMediumImageURL,reqObj.serviceDescription, reqObj.categoryId, reqObj.subCategoryItemId, reqObj.locationName,
         reqObj.latitude,reqObj.longitude, reqObj.serviceStartingPrice,reqObj.paymentMethods]
         );
			let data = result.rowCount > 0 ? result.rows[0] : null;
			return { error: false, data, message: 'Data saved successfully' };

		} catch (error) {
			return { error: true, message: error.toString() };
		}
   },

   update: async (reqObj, client)=>{
      try {
         const result = await  client.query(`UPDATE services SET
            "serviceName" = $2,
            "userId" = $3
            "serviceImageURL" = $4,
            "serviceThumpImageURL" = $5 ,
            "serviceMediumImageURL" = $6 ,
            "serviceDescription" = $7,
            "categoryId" = $8 ,
            "subCategoryItemId" = $9,
            "locationName" = $10,
            "latitude" = $11 ,
            "longitude" = $12 ,
            "serviceStartingPrice" = $13 ,
            "paymentMethods" = $14,
            "isActive" = $15,
            "updatedAt" = now()
            WHERE "serviceId" = $1 RETURNING *`,
            [reqObj.serviceId, reqObj.serviceName, reqObj.userId, reqObj.serviceImageURL, reqObj.serviceThumpImageURL, reqObj.serviceMediumImageURL, 
            reqObj.serviceDescription,reqObj.categoryId, reqObj.subCategoryItemId, reqObj.locationName, 
            reqObj.latitude, reqObj.longitude, reqObj.serviceStartingPrice,reqObj.paymentMethods, reqObj.isActive]
         );

         let data = result.rowCount > 0 ? result.rows[0] : null;
         return { error: false, data, message: 'Data update successfully' };
      } catch (error) {
         return { error: true, message: error.toString() };
      }
   },

   getOne: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
            "serviceId",
            "serviceName" ,
            "userId" ,
            "serviceImageURL",
            "serviceThumpImageURL" ,
            "serviceMediumImageURL" ,
            "serviceDescription",
            "categoryId" ,
            "subCategoryItemId",
            "locationName" ,
            "latitude" ,
            "longitude" ,
            "serviceStartingPrice" ,
            "paymentMethods",
            "isActive",
            "createdAt"
            FROM services WHERE "serviceId" = $1
         `,[reqObj.id]);
         return {error: false, data: result.rows}
      } catch (error){
         return { error: true, message: error.toString()}
      }
   },

   getAll: async (reqObj, client) => {
      try{
         const queryText = `SELECT 
            "serviceId", "serviceName" , "userId" , "serviceImageURL",
            "serviceThumpImageURL", "serviceMediumImageURL", "serviceDescription",
            "categoryId", "subCategoryItemId", "locationName", "latitude",
            "longitude", "serviceStartingPrice", "paymentMethods", "isActive", "createdAt",
         ( 3959 * acos( cos( radians($2) ) * cos( radians( S.latitude ) ) * cos( radians( S.longitude ) - radians($3) ) + sin( radians($2) ) * sin( radians( S.latitude) ) ) ) AS distance
         FROM  services S
         WHERE "isActive" = $1`
         var qryValue = [true,  reqObj.latitude, reqObj.longitude]

         if(reqObj.isNearby){
            queryText += ` AND distance < $4`
            qryValue = [true,  reqObj.latitude, reqObj.longitude, 100]
      }
         const result = await client.query(`${queryText}`, qryValue);
         return {error: false, data: result.rows, message:'Read successfully'};

      } catch (error){
            return { error : true,  message : error.toString()}
      } 
   },

   relativeServices : async (reqObj ,client) => {
      try{
         const limit = 50;
         const result = await client.query(`SELECT
         S."serviceId", S."serviceName", S."userId", S."serviceDescription",
         S."categoryId", S."subCategoryItemId", S."locationName", S."latitude",
         S."serviceImageURL", S."serviceThumpImageURL", S."serviceMediumImageURL",
         S."longitude", S."serviceStartingPrice", P."paymentMethods",
         S."createdAt", S."updatedAt", S."isActive",         
         CI."categoryItemName"
         FROM "services" as S
         INNER JOIN "categoryItems" CI ON CI."categoryItemId" =  S."subCategoryItemId"        
         WHERE S."isActive" =$1
         AND S."subCategoryItemId" = $2
         LIMIT $3`, [true, reqObj.subCategoryItemId, limit]);

         return {error: false , data: result.rows, message: 'read successfully'}
      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   remove: async (reqObj, client) => {
      try{
         const result = await client.query(
            `UPDATE services SET "isActive" = $1 WHERE "serviceId" = $2` , [false, reqObj.serviceId]
         )
         if(result.rowCount > 0) {
            return {error: false, message: 'Deleted successfully'}
         } else{
            return {error: true, message : 'Deleted failed'}
         }
      } catch (error){
      return { error: true, message: error.toString()}
      }
   },
}

