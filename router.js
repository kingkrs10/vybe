const express = require("express");
const router = express.Router();
const userRouter = require('./src/users');
const offersRouter = require('./src/offers');
const userInvitesRouter = require('./src/userInvites');
const notificationsRouter = require('./src/notifications');

router.use('/users', userRouter);
router.use('/offers', offersRouter);
router.use('/userInvites', userInvitesRouter);
router.use('/notifications', notificationsRouter);

module.exports = router;