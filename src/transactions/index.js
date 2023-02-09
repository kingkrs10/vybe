const express = require("express");
const router = express.Router();
const transactionsController = require("./controller");
const { authMiddleware } = require("../common/common");

router.post("/", authMiddleware, transactionsController.create);
router.get("/all", authMiddleware, transactionsController.getAll);
router.patch("/:id", authMiddleware, transactionsController.update);
router.get("/:id", authMiddleware, transactionsController.getOne);
router.delete("/:id", authMiddleware, transactionsController.remove);

module.exports = router;
