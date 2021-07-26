const express = require("express");
const router = express.Router();
const notificationsController = require("./controller");
const { authMiddleware, upload } = require('../common/common');

router.post("/",
    authMiddleware,
    upload.none(),
    notificationsController.create
);

router.get(
    "/:id",
    authMiddleware,
    notificationsController.getUsersNotification
);

module.exports = router;
