const express = require("express");
const router = express.Router();
const usersController = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.post(
    "/",
    upload.single('image'),
    usersController.create
);
router.put(
    "/:id",
    authMiddleware,
    upload.single('image'),
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
    upload.none(),
    usersController.updateLocation
);
router.put(
    "/blockedUsers/:id",
    authMiddleware,
    upload.none(),
    usersController.updateBlockedUsers
);
router.get(
    "/getAuthToken/:phoneNumber",
    usersController.getAuthToken
);
router.put(
    "/updateMobileNumber/:id",
    authMiddleware,
    upload.none(),
    usersController.updateMobileNumber
)
module.exports = router;
