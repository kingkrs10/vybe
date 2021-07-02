const express = require("express");
const router = express.Router();
const messageController = require("./controller");
const commonModel = require('../common/common');
const { authMiddleware, upload } = require('../common/common');

router.post("/",
    authMiddleware,
    upload.none(),
    messageController.create
);

router.get(
    "/:uid/:chatId",
    authMiddleware,
    messageController.getOne
);

router.put(
    "/:id",
    authMiddleware,
    upload.none(),
    messageController.update
);

router.put(
    "/updateUnRead/:id",
    authMiddleware,
    upload.none(),
    messageController.updateUnRead
);

router.get(
    "/:id",
    authMiddleware,
    messageController.getOne
);

module.exports = router;
