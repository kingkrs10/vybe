module.exports ={
   create : async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO "productReviews" (
            "productReviewId", "userId", "productId", "ratings", "title",
            "description", "reviewImageURL", "reviewThumpImageURL", "reviewMediumImageURL"
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
         [
            reqObj.productReviewId,
            reqObj.userId,
            reqObj.productId,
            reqObj.ratings,
            reqObj.title,
            reqObj.description,
            reqObj.reviewImageURL,
            reqObj.reviewThumpImageURL,
            reqObj.reviewMediumImageURL
         ])
         return{ error: false, message:'Created successfully'}
      } catch(error){
         return { error: true, message: error.toString()}
      }
   },

   update : async (reqObj, client) => {
      try{
         const result = await client.query(`UPDATE "productReviews" SET
            "ratings" = $1,
            "title" = $2,
            "description" = $3,
            "reviewImageURL" = $4,
            "reviewThumpImageURL" = $5,
            "reviewMediumImageURL" = $6,
            "updatedAt" = now()
            WHERE "productReviewId" = $7
         `,
         [
            reqObj.ratings,
            reqObj.title,
            reqObj.description,
            reqObj.reviewImageURL,
            reqObj.reviewThumpImageURL,
            reqObj.reviewMediumImageURL,
            reqObj.productReviewId,
         ])
         return{ error: false, message:'Updated successfully'}

      } catch(error){
         return { error: true, message: error.toString()}
      }
   },

   getAll: async (reqObj ,client) => {
      try{
         const result = await client.query(`SELECT
            PR."productReviewId", PR."userId",  PR."productId",  PR."ratings",  PR."title",
            PR."description",  PR."reviewImageURL",  PR."reviewThumpImageURL",  PR."reviewMediumImageURL",
            PR."createdAt", PR."updatedAt",
            U."fullName", U."userImage", U."userMediumImage", U."userThumpImage",
            P."productName"
            FROM "productReviews" AS PR
            INNER JOIN users U ON U."userId" = PR."userId"
            INNER JOIN products P ON P."productId" = PR."productId"
         WHERE PR."productId" = $1
         `, [reqObj.productId]);

         return {error: false, data: result.rows, message:'Read successfully'}
      } catch (error){
         return { error : true,  message : error.toString()}
      }
   },

   getReviewtotal: async (reqObj ,client) => {
      try{
         const whereCondition = `"productId" = $1 AND "isActive" = $2`;
         const result = await client.query(`SELECT COUNT(*) as "totalCount",
            (SELECT COUNT(ratings) FROM "productReviews" WHERE ratings = '1' AND ${whereCondition}) as "oneStarRating",
			   (SELECT COUNT(ratings) FROM "productReviews" WHERE ratings = '2' AND ${whereCondition}) as "twoStarRating",
			   (SELECT COUNT(ratings) FROM "productReviews" WHERE ratings = '3' AND ${whereCondition}) as "threeStarRating",
			   (SELECT COUNT(ratings) FROM "productReviews" WHERE ratings = '4' AND ${whereCondition}) as "FourStarRating",
			   (SELECT COUNT(ratings) FROM "productReviews" WHERE ratings = '5' AND ${whereCondition}) as "FiveStarRating"
            FROM "productReviews"
            WHERE ${whereCondition}`
         , [reqObj.productId , true]);
         let resultData = result.rows[0];
         resultData.subTotal = 0;
         Object.keys(result.rows[0]).map((item,index) =>{
            if (item !== 'totalCount' && item !== 'subTotal') {
               resultData.subTotal = resultData.subTotal + (resultData[item] * index);
               resultData[item] = (resultData[item]/resultData.totalCount)*100;
            }
         })
         resultData.subTotal = resultData.subTotal / resultData.totalCount;
         return { error: false, data: resultData, message:'Read successfully'}
      } catch (error){
         return { error : true,  message : error.toString()}
      }
   },

   getOne : async (reqObj ,client) => {
      try{
         const result = await client.query(`SELECT
         PR."productReviewId", PR."userId",  PR."productId",  PR."ratings",  PR."title",
         PR."description",  PR."reviewImageURL",  PR."reviewThumpImageURL",  PR."reviewMediumImageURL",
         PR."createdAt", PR."updatedAt",
         U."fullName", U."userImage", U."userMediumImage", U."userThumpImage",
         P."productName"
         FROM "productReviews" AS PR
         INNER JOIN users U ON U."userId" = PR."userId"
         INNER JOIN products P ON P."productId" = PR."productId"
         WHERE PR."productId" = $1
         AND PR."productReviewId" = $2`,
         [reqObj.productId, reqObj.productReviewId])
         return {error: false , data: result.rows, message: 'Read successfully'}

      } catch(error){
         return {error: true, message: error.toString()}
      }
   },

   remove : async (reqObj ,client) => {
      try{
         const result = await client.query(`DELETE
         FROM "productReviews"
         WHERE "productReviewId" = $1`,
         [reqObj.productReviewId])

         return {error: false ,  message: 'Deleted successfully'}

      } catch(error){
         return {error: true, message: error.toString()}
      }
   }
}
