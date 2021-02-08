const express = require("express");
const router = express.Router();
const chatsController = require("./controller");
const commonModel = require('../common/common');


router.post("/", commonModel.upload.none(), chatsController.create);
router.get("/:uid", chatsController.getAll);
router.get("/:uid/:id", chatsController.getOne);
router.delete("/:id", chatsController.remove);

module.exports = router;
