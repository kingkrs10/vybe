module.exports = {
   create:async(reqObj, client)=>{
      try {
         const result = await client.query(`INSERT INTO services
         (
            "serviceId",
            "serviceName" ,
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
         VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`,
         [reqObj.serviceId, reqObj.serviceName, reqObj.serviceImageURL, reqObj.serviceThumpImageURL, reqObj.serviceMediumImageURL,
          reqObj.serviceDescription, reqObj.categoryId, reqObj.subCategoryItemId, reqObj.locationName, reqObj.latitude,
          reqObj.longitude, reqObj.serviceStartingPrice,reqObj.paymentMethods]
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
            "serviceImageURL" = $3,
            "serviceThumpImageURL" = $4 ,
            "serviceMediumImageURL" = $5 ,
            "serviceDescription" = $6,
            "categoryId" = $7 ,
            "subCategoryItemId" = $8,
            "locationName" = $9,
            "latitude" = $10 ,
            "longitude" = $11 ,
            "serviceStartingPrice" = $12 ,
            "paymentMethods" = $13,
            "isActive" = $14,
            "updatedAt" = now()
            WHERE "serviceId" = $1 RETURNING *`,
            [reqObj.serviceId, reqObj.serviceName, reqObj.serviceImageURL, reqObj.serviceThumpImageURL, reqObj.serviceMediumImageURL, 
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
            "serviceId", "serviceName" ,"serviceImageURL",
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

