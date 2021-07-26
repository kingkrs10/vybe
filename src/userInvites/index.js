const express = require("express");
const router = express.Router();
const usersInvitesController = require("./controller");
const { authMiddleware, upload } = require('../common/common');

router.post(
    "/",
    authMiddleware,
    upload.none(),
    usersInvitesController.create
);

router.put(
    "/:id",
    authMiddleware,
    upload.none(),
    usersInvitesController.update
);

router.get(
    "/:id",
    authMiddleware,
    upload.none(),
    usersInvitesController.getUserInvites
);

module.exports = router;
