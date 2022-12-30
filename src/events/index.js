const express = require("express");
const router = express.Router();
const eventsController = require("./controller");
const { authMiddleware } = require("../common/common");

router.post("/", authMiddleware, eventsController.create);
router.get("/all", authMiddleware, eventsController.getAll);
router.get("/allevents", eventsController.getAllEvents);
router.patch("/:id", authMiddleware, eventsController.update);
router.get("/:id", authMiddleware, eventsController.getOne);
router.delete("/:id", authMiddleware, eventsController.remove);

module.exports = router;
