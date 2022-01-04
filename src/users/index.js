const express = require("express");
const router = express.Router();
const usersController = require("./controller");
const { authMiddleware } = require('../common/common');

router.post(
    "/",
    usersController.create
);

router.put(
    "/:id",
    authMiddleware,
    usersController.update
);

router.get(
    "/",
    authMiddleware,
    usersController.getAll
);

router.get(
    "/recentUsers",
    authMiddleware,
    usersController.getRecentUsers
);

router.get(
    "/:id",
    authMiddleware,
    usersController.getOne
);

router.delete(
    "/:id",
    authMiddleware,
    usersController.remove
);

router.put(
    "/location/:id",
    authMiddleware,
    usersController.updateLocation
);

router.put(
    "/blockedUsers/:id",
    authMiddleware,
    usersController.updateBlockedUsers
);

router.get(
    "/blockedUsers/:id",
    authMiddleware,
    usersController.getBlockedUsers
);

router.get(
    "/getAuthToken/:phoneNumber",
    usersController.getAuthToken
);

router.put(
    "/updateStripeId/:id",
    authMiddleware,
    usersController.updateStripeId
);
module.exports = router;
