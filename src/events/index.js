const express = require("express");
const router = express.Router();
const eventsController = require("./controller");
const { authMiddleware } = require("../common/common");

router.post("/", authMiddleware, eventsController.create);
router.get("/all", eventsController.getAll);
router.get("/allevents", eventsController.getAllEvents);
router.patch("/:id", authMiddleware, eventsController.update);
router.patch("/publish/:id", authMiddleware, eventsController.publish);
router.get("/:id", eventsController.getOne);
router.delete("/:id", authMiddleware, eventsController.remove);

module.exports = router;
