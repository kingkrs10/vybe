const express = require("express");
const router = express.Router();
const ticketsController = require("./controller");
const { authMiddleware } = require("../common/common");

router.post("/", authMiddleware, ticketsController.create);
router.get("/all", authMiddleware, ticketsController.getAll);
router.patch("/:id", authMiddleware, ticketsController.update);
router.get("/:id", authMiddleware, ticketsController.getOne);
router.delete("/:id", authMiddleware, ticketsController.remove);

module.exports = router;
