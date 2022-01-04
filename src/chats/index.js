const express = require("express");
const router = express.Router();
const chatsController = require("./controller");
const { authMiddleware } = require('../common/common');

router.post(
    "/",
    authMiddleware,
    chatsController.create
);
router.get(
    "/:uid",
    authMiddleware,
    chatsController.getAll
);
router.get(
    "/:uid/:id",
    authMiddleware,
    chatsController.getOne
);
router.delete(
    "/:id",
    authMiddleware,
    chatsController.remove
);

module.exports = router;
