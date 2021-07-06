const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.post(
    "/firebase/notification",
    upload.none(),
    authMiddleware,
    controller.pushFirebaseNotification
);

router.post(
    "/sendSMS",
    upload.none(),
    authMiddleware,
    controller.sendSMS
);

router.post(
    "/sendMail",
    upload.none(),
    authMiddleware,
    controller.sendMail
);

module.exports = router;
