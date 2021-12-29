const express = require("express");
const router = express.Router();
const statusController = require("./controller");
const { authMiddleware} = require('../common/common');

router.get(
   "/",
   authMiddleware,
   statusController.getAll
);

module.exports = router;