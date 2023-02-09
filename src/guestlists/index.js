const express = require("express");
const router = express.Router();
const guestlistsController = require("./controller");
const { authMiddleware } = require("../common/common");

router.post("/", authMiddleware, guestlistsController.create);
router.get("/all", authMiddleware, guestlistsController.getAll);
router.patch("/:id", authMiddleware, guestlistsController.update);
router.get("/:id", authMiddleware, guestlistsController.getOne);
router.delete("/:id", authMiddleware, guestlistsController.remove);

module.exports = router;
