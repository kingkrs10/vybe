const express = require("express");
const router = express.Router();
const upcController = require("./controller");
const { authMiddleware, upload } = require("../common/common");

router.post("/", authMiddleware, upcController.create);

router.put("/:id", authMiddleware, upcController.update);

router.get("/", authMiddleware, upcController.getAll);

router.get("/:id", authMiddleware, upcController.getOne);

router.delete("/:id", authMiddleware, upcController.remove);

module.exports = router;
