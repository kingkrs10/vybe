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

router.post(
    "/migration",
    upload.none(),
    authMiddleware,
    controller.migration
);

router.post(
    "/firebaseImageDownload/:id",
    upload.none(),
    authMiddleware,
    controller.firebaseImageDownload
);

router.post(
    "/firebaseImageResize/:id",
    upload.none(),
    authMiddleware,
    controller.firebaseImageResize
);

router.post(
    "/firebaseImageUpload/:id",
    upload.none(),
    authMiddleware,
    controller.firebaseImageUpload
);
router.post(
    "/firebaseImageDelete/:id",
    upload.none(),
    authMiddleware,
    controller.firebaseImageDelete
);

module.exports = router;
