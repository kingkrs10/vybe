const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { authMiddleware, upload } = require('../common/common');

router.get(
    "/",
    authMiddleware,
    controller.getCurrency
);


module.exports = router;
