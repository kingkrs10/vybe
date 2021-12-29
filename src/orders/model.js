module.exports = {
   create : async (reqObj, client) => {
      try{
         const result = await client.query(`INSERT INTO orders (
            "orderId",
            "userId",
            "shopId",
            "orderTotalQty",
            "orderSubTotalPrice",
            "OrderTaxPrice",
            "OrderShippingPrice",
            "orderDiscount",
            "orderTotalPrice",
            "orderStatusId",
            "orderPaymentMethodId",
            "orderPaymentStatusId",
            "orderPaymentTransactionId"
         ) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
         [
            reqObj.orderId,
            reqObj.userId,
            reqObj.shopId,
            reqObj.orderTotalQty,
            reqObj.orderSubTotalPrice,
            reqObj.OrderTaxPrice,
            reqObj.OrderShippingPrice,
            reqObj.orderDiscount,
            reqObj.orderTotalPrice,
            reqObj.orderStatusId,
            reqObj.orderPaymentMethodId,
            reqObj.orderPaymentStatusId,
            reqObj.orderPaymentTransactionId
         ])
         let data =[];
         return{ error: false, message:'Created successfully'}

      } catch(error){
         return { error: true, message: error.toString()}
      }
   },

   getAll: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
            O."orderId",O."userId",U."fullName" ,U."userImage",O."shopId",O."orderTotalQty",O."orderSubTotalPrice",
            O."OrderTaxPrice",O."OrderShippingPrice",O."orderDiscount",O."orderTotalPrice",O."orderStatusId",
            s1."statusName" as "orderStatusName",O."orderPaymentMethodId",p."paymentMethodName",O."orderPaymentStatusId",
            s2."statusName" as "orderPaymentStatusName",O."orderPaymentTransactionId", O."createdAt"
            FROM "orders" O
            INNER JOIN "paymentMethods" p ON  p."paymentMethodId" = O."orderPaymentMethodId"
            INNER JOIN "status" s1 ON s1."statusId" = O."orderStatusId"
            INNER JOIN "status" s2 ON s2."statusId" = O."orderPaymentStatusId"
            INNER JOIN "users" U ON U."uid" = O."userId"
            WHERE O."shopId" = $1
         `,[reqObj.shopId])

         return { error: false, data: result.rows, message: 'Read Successfully'}

      } catch(error){
         return{ error: true, message:error.toString()}
      }
   },
   getOne: async (reqObj, client) => {
      try{
         const result = await client.query(`SELECT
            O."orderId",O."userId",U."fullName",U."userImage",O."shopId",O."orderTotalQty",O."orderSubTotalPrice",
            O."OrderTaxPrice",O."OrderShippingPrice",O."orderDiscount",O."orderTotalPrice",O."orderStatusId",
            s1."statusName" as "orderStatusName",O."orderPaymentMethodId",p."paymentMethodName",O."orderPaymentStatusId",
            s2."statusName" as "orderPaymentStatusName",O."orderPaymentTransactionId", O."createdAt"
            FROM "orders" O
            INNER JOIN "paymentMethods" p ON  p."paymentMethodId" = O."orderPaymentMethodId"
            INNER JOIN "status" s1 ON s1."statusId" = O."orderStatusId"
            INNER JOIN "status" s2 ON s2."statusId" = O."orderPaymentStatusId"
            INNER JOIN "users" U ON U."uid" = O."userId"
            WHERE O."shopId" = $1
            AND O."orderId" = $2
         `,[reqObj.shopId, reqObj.orderId])

         return { error: false, data: result.rows, message: 'Read Successfully'}

      } catch(error){
         return{ error: true, message:error.toString()}
      }
   },

   updateStatus: async (reqObj, client) => {
      try{
         const {id, Obj} = reqObj
         const statusColumnName = Obj.orderPaymentStatusId ? "orderPaymentStatusId" : "orderStatusId";
         const result = await client.query(`UPDATE "orders" SET
         "${statusColumnName}" = $2
         WHERE "orderId" = $1
         `,[id, Obj[statusColumnName]]);

         return{ error: false, message:'Updated successfully'};

      } catch(error){
         return{ error: true, message:error.toString()}
      }
   }
}

