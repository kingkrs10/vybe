const express = require("express");
const router = express.Router();
const messageController = require("./controller");
const commonModel = require('../common/common');

router.post("/", commonModel.upload.none(), messageController.create);
router.get("/:uid/:chatId", messageController.getOne);
router.put("/:id", commonModel.upload.none(), messageController.update);
router.put("/updateUnRead/:id", commonModel.upload.none(), messageController.updateUnRead);
router.get("/:id", messageController.getOne);

module.exports = router;
