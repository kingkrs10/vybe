const express = require("express");
const router = express.Router();
const Controller = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.get(
    "/",
    authMiddleware,
    Controller.getAllMenus
)

module.exports = router;