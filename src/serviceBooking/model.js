module.exports={  
  create:async(reqObj, client)=>{
    try {
			const result = await client.query(`INSERT INTO "serviceBooking"
				(
          "serviceBookingId",
          "serviceName",
          "serviceId",
          "userId",
          "bookingDate" ,
          "bookingJobDetails" ,
          "locationName",
          "latitude",
          "longitude",
          "bookingStatus",
          "paymentStatus"
				)
				VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
				[
					reqObj.serviceBookingId, reqObj.serviceName, reqObj.serviceId, reqObj.userId,
					reqObj.bookingDate, reqObj.bookingJobDetails, reqObj.locationName, 
					reqObj.latitude, reqObj.longitude, reqObj.bookingStatus, reqObj.paymentStatus
				]
			);
    	let data = result.rowCount > 0 ? result.rows[0] : null;
    	return { error: false, data, message: 'Service booked successfully'};

  	} catch (error) {
    	return { error: true, message: error.toString() };
  	}
 	},

	update : async (reqObj, client) => {
		try{
			const result = await client.query(`UPDATE "serviceBooking" SET
					"serviceName" = $2,
					"serviceId" = $3,
					"bookingDate" = $4,
					"bookingJobDetails" = $5,
					"locationName" = $6,
					"latitude" = $7,
					"longitude" = $8,
					"bookingStatus" = $9,
					"paymentStatus" = $10,
					"updatedAt" = now()
					WHERE "serviceBookingId" = $1`,
			[  reqObj.serviceBookingId, reqObj.serviceName, reqObj.serviceId,
					reqObj.bookingDate, reqObj.bookingJobDetails, reqObj.locationName,
					reqObj.latitude, reqObj.longitude, reqObj.bookingStatus, reqObj.paymentStatus
			])
			//  let data = result.rowCount > 0 ? result.rows[0] : null;
			return{ error: false, data:result.rows, message:'Updated successfully'};
		} catch(error){
			return { error: true, message: error.toString()}
		}
	},

	getOne: async (reqObj, client) => {
		try{
			const result = await client.query(`SELECT
				"serviceBookingId", "serviceName", "serviceId",
				"bookingDate", "bookingJobDetails", "locationName",
				"latitude", "longitude", "bookingStatus", "paymentStatus",
				"createdAt", "updatedAt"
				FROM "serviceBooking" 
				WHERE "serviceBookingId" = $1
			`,[reqObj.id]);
			return {error: false, data: result.rows}
		} catch (error){
			return { error: true, message: error.toString()}
		}
	},

	getAll: async (reqObj, client) => {
		try{
			const result = await client.query( `SELECT 
				"serviceBookingId", "serviceName" ,"serviceId",
				"bookingDate", "bookingJobDetails", "locationName", "latitude",
				"longitude", "bookingStatus", "paymentStatus","createdAt"
				FROM  "serviceBooking"`
			);
			return {  error: false, data: result.rows, message:'Read successfully' };
		} catch (error){
			return { error : true,  message : error.toString()}
		} 
	},
}