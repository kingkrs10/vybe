const express = require("express");
const router = express.Router();
const usersInvitesController = require("./controller");
const { authMiddleware} = require('../common/common');

router.post(
    "/",
    authMiddleware,
    usersInvitesController.create
);

router.put(
    "/:id",
    authMiddleware,
    usersInvitesController.update
);

router.get(
    "/:id",
    authMiddleware,
    usersInvitesController.getUserInvites
);

module.exports = router;
