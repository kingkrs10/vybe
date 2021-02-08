const express = require("express");
// const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./src/config/config");
const app = express();

const userRouter = require('./src/users');
const offersRouter = require('./src/offers');
const userInvitesRouter = require('./src/userInvites');
const notificationsRouter = require('./src/notifications');
const chatsRouter = require('./src/chats');
const messagesRouter = require('./src/messages');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/offers', offersRouter);
app.use('/api/v1/userInvites', userInvitesRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/chats', chatsRouter);
app.use('/api/v1/messages', messagesRouter);

app.listen(config.app.port, () => {
    console.log(`Example app listening on port ${config.app.port}!`)
});

