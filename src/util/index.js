const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { authMiddleware} = require('../common/common');

router.post(
    "/firebase/notification",
    authMiddleware,
    controller.pushFirebaseNotification
);

router.post(
    "/sendSMS",
    authMiddleware,
    controller.sendSMS
);

router.post(
    "/sendMail",
    authMiddleware,
    controller.sendMail
);

router.post(
    "/migration",
    authMiddleware,
    controller.migration
);

router.post(
    "/firebaseImageDownload/:id",
    authMiddleware,
    controller.firebaseImageDownload
);

router.post(
    "/firebaseImageResize/:id",
    authMiddleware,
    controller.firebaseImageResize
);

router.post(
    "/firebaseImageUpload/:id",
    authMiddleware,
    controller.firebaseImageUpload
);
router.post(
    "/firebaseImageDelete/:id",
    authMiddleware,
    controller.firebaseImageDelete
);

router.post(
    "/offerMigration",
    authMiddleware,
    controller.offerMigration
);


module.exports = router;
