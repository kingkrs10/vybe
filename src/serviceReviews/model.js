module.exports = {
  create: async (reqObj, client) => {
    try {
      const result = await client.query(
        `INSERT INTO "serviceReviews"
      (
        "serviceReviewId",
         "userId",
         "serviceId",
         "ratings",
         "title",
         "description",
         "reviewImageURL",
         "reviewThumpImageURL",
         "reviewMediumImageURL"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *`,
        [
          reqObj.serviceReviewId,
          reqObj.userId,
          reqObj.serviceId,
          reqObj.ratings,
          reqObj.title,
          reqObj.description,
          reqObj.reviewImageURL,
          reqObj.reviewThumpImageURL,
          reqObj.reviewMediumImageURL
        ]
      );

      let data = result.rowCount > 0 ? result.rows[0] : null;
      return { error: false, data, message: "Data saved successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },
  update: async (reqObj, client) => {
    try {
      const result = await client.query(
        `UPDATE "serviceReviews" SET
          "userId" = $1,
          "serviceId" = $2,
          "ratings" = $3,
          "title" = $4,
          "description" = $5,
          "reviewImageURL" = $6,
          "reviewThumpImageURL" = $7,
          "reviewMediumImageURL" = $8,
          "updatedAt" = now()
         WHERE "serviceReviewId" = $9 RETURNING *
       `,
        [
          reqObj.userId,
          reqObj.serviceId,
          reqObj.ratings,
          reqObj.title,
          reqObj.description,
          reqObj.reviewImageURL,
          reqObj.reviewThumpImageURL,
          reqObj.reviewMediumImageURL,
          reqObj.serviceReviewId
        ]
      );
      return { error: false,data: result.rows, message: "Updated successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },
  getAll: async (reqObj, client) => {
    try {
      const result = await client.query(
        `SELECT
           SR."serviceReviewId", SR."userId",  SR."serviceId",  SR."ratings",  SR."title",
           SR."description",  SR."reviewImageURL",  SR."reviewThumpImageURL",  SR."reviewMediumImageURL",
           SR."createdAt", SR."updatedAt",
           U."fullName", U."userImage", U."userMediumImage", U."userThumpImage",
           S."serviceName"
      FROM "serviceReviews" AS SR
      INNER JOIN users U ON U."userId" = SR."userId"
      INNER JOIN services S ON S."serviceId" = SR."serviceId"
      WHERE SR."serviceId" = $1
     `,
        [reqObj.serviceId]
      );

      return { error: false, data: result.rows, message: "Read successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  getOne: async (reqObj, client) => {
    try {
      const result = await client.query(
        `SELECT
           SR."serviceReviewId", SR."userId",  SR."serviceId",  SR."ratings",  SR."title",
           SR."description",  SR."reviewImageURL",  SR."reviewThumpImageURL",  SR."reviewMediumImageURL",
           SR."createdAt", SR."updatedAt",
           U."fullName", U."userImage", U."userMediumImage", U."userThumpImage",
           S."serviceName"
        FROM "serviceReviews" AS SR
        INNER JOIN users U ON U."userId" = SR."userId"
        INNER JOIN services S ON S."serviceId" = SR."serviceId"
        WHERE SR."serviceId" = $1 AND SR."serviceReviewId" = $2`,
        [reqObj.serviceId, reqObj.serviceReviewId]
      );
      return { error: false, data: result.rows, message: "Read successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  },

  remove: async (reqObj, client) => {
    try {
      const result = await client.query(
        `DELETE
           FROM "serviceReviews"
           WHERE "serviceReviewId" = $1`,
        [reqObj.serviceReviewId]
      );

      return { error: false, message: "Deleted successfully" };
    } catch (error) {
      return { error: true, message: error.toString() };
    }
  }
};
