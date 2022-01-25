const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { authMiddleware} = require('../common/common');

router.post(
   "/",
   authMiddleware,
   controller.create
)

module.exports = router;