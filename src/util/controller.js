const twilio = require("twilio");
const nodemailer = require("nodemailer");
const {sendErroresponse, sendInternalErrorResponse, sendSuccessResponse } = require("../common/ResponseController");
const { firebaseAdmin } = require("../common/firebase");
const { twilioTest } = require("../config/config");
const accountSid = twilioTest.accountSid;
const authToken = twilioTest.authToken;

const client = nodemailer.createTransport({
   host: "smtp.gmail.com",
   port: 465,
   service: "gmail",
   secure: false,
   //smtp.gmail.com  //in place of service use host...
   auth: {
      user: "luhubusiness@gmail.com",
      pass: "Spyd3r3x20khybr!dEx1",
      // pass: 'hclegcszmdjqmqln'
   },
});

const notification_options = {
   priority: "high",
   timeToLive: 60 * 60 * 24,
};

const pushFirebaseNotification = async (request, response) => {
   try {
      console.log('pushFirebaseNotification', request.body);
      const { deviceId, name } = request.body;
      var registrationToken = deviceId;
      var message = {
         data: { messageFrom: `${name}`, report: "true" },
         notification: {
            title: `${name}`,
            body: `${name} ❤ favorited your post.`,
            sound: "default",
         },
      };

      firebaseAdmin
         .messaging()
         .sendToDevice(registrationToken, message, notification_options)
         .then(result => {
            console.log('result', result);
            sendSuccessResponse(response, {message: "Notification sent successfully"})
         })
         .catch(error => {
            console.log(error);
            sendErroresponse(response, error.toString());
         });

   } catch (err) {
      sendInternalErrorResponse(response, { message: err.toString() });
   }
};

const sendSMS = async (request, response) => {
   try {
      var client = new twilio(accountSid, authToken);
      const { body, to } = request.body;
      client.messages
         .create({
            body: body,
            to: to,
            from: "+12314409907", // https://www.twilio.com/console should we get the free trail number ? click the "Twilio free trail number" button ..
         })
         .then((message) => {
            sendSuccessResponse(response, message);
         })
         .catch((error) => {
            sendErroresponse(response, error.toString());
         });
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}

const sendMail = async (request, response) => {
   try {
      const { reportMessage, reportFrom, reportTo, deviceId } = request.body;

      // const destAdd = "luhubusiness@gmail.com";
      const destAdd = "kannan.d@mitrahsoft.com";

      const mailOptionsInfo = {
         from: "luhubusiness@gmail.com",
         to: destAdd,
         subject: "Luhu report",
         html: `<b>Hi,</b><br><br><p><b>${reportFrom.fullname}</b> reported as "${reportMessage}" to <b>${reportTo.fullname}</b></p>`,
      };

      var messageNotification = {
         data: {
            Id: `${reportTo}`,
            messageFrom: `${reportFrom.fullname}`,
            report: "true",
         },
         notification: {
            title: `${reportFrom.fullname}`,
            body: `${reportFrom.fullname} report to your post`,
            sound: "default",
         },
      };
      var deviceToken = deviceId;
      firebaseAdmin
         .messaging()
         .sendToDevice(
            deviceToken,
            messageNotification,
            notification_options
         )
         .then((response) => {
            // Response is a message ID string.
            console.log("Message send Successfully:", response);
            return true; //<- return a value
         })
         .catch((error) => {
            console.log("Message sending error:", response);
         });

      client.sendMail(mailOptionsInfo, (err, info) => {
         if (err) {
            console.log("errr", err);
            sendErroresponse(response, err.toString());
         }
         console.log("info", info);
         sendSuccessResponse(response, {message:  `Mensagem enviada com sucesso. Id: ${info.messageId} | Response: ${info.response}`});
      });
   } catch (error) {
      sendInternalErrorResponse(response, { message: error.toString() });
   }
}


module.exports = {
   pushFirebaseNotification,
   sendSMS,
   sendMail
};
