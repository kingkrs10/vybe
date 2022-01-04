const express = require("express");
const router = express.Router();
const messageController = require("./controller");
const { authMiddleware } = require('../common/common');

router.post("/",
    authMiddleware,
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
    messageController.update
);

router.put(
    "/updateUnRead/:id",
    authMiddleware,
    messageController.updateUnRead
);

router.get(
    "/:id",
    authMiddleware,
    messageController.getOne
);

module.exports = router;
