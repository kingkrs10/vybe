const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./src/config/config");
const app = express();

const userRouter = require("./src/users");
const offersRouter = require("./src/offers");
const userInvitesRouter = require("./src/userInvites");
const notificationsRouter = require("./src/notifications");
const chatsRouter = require("./src/chats");
const messagesRouter = require("./src/messages");
const stripeRouter = require("./src/stripe");

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

app.listen(config.app.port, () => {
   console.log(`Example app listening on port ${config.app.port}!`);
});
