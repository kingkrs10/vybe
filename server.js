const express = require("express");
const cors = require("cors");
const config = require("./src/config/config");
const app = express();
const { firebaseAdmin } = require("./src/common/firebase");
const { authMiddleware, upload } = require('./src/common/common');

const userRouter = require("./src/users");
const offersRouter = require("./src/offers");
const userInvitesRouter = require("./src/userInvites");
const notificationsRouter = require("./src/notifications");
const chatsRouter = require("./src/chats");
const messagesRouter = require("./src/messages");
const stripeRouter = require("./src/stripe");
const notification_options = {
   priority: "high",
   timeToLive: 60 * 60 * 24
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/users", userRouter);
app.use("/offers", offersRouter);
app.use("/userInvites", userInvitesRouter);
app.use("/notifications", notificationsRouter);
app.use("/chats", chatsRouter);
app.use("/messages", messagesRouter);
app.use("/stripe", stripeRouter);

app.post('/firebase/notification', upload.none(), authMiddleware, (req, res) => {
   const { deviceId, name } = req.body;
   var registrationToken = deviceId;
   var message = {
      data: { messageFrom: `${name}`, report: "true" },
      notification: {
         title: `${name}`,
         body: `${name} ❤ favorited your post.`,
         sound: "default",
      },
   };
   const options = notification_options

   firebaseAdmin.messaging().sendToDevice(registrationToken, message, options)
      .then(response => {
         res.status(200).send("Notification sent successfully")
      })
      .catch(error => {
         console.log(error);
      });
})

app.listen(config.app.port, () => {
   console.log(`Example app listening on port ${config.app.port}!`);
});
