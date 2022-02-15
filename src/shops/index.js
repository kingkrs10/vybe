const express = require("express");
const router = express.Router();
const shopsController = require("./controller");
const { authMiddleware, upload } = require("../common/common");

router.post("/", authMiddleware, shopsController.create);

router.put("/:id", authMiddleware, shopsController.update);

router.post("/dashboard", authMiddleware, shopsController.dashboard);

router.get("/", authMiddleware, shopsController.getAll);

router.get("/:id", authMiddleware, shopsController.getOne);

router.post("/viewAll", authMiddleware, shopsController.viewAllShops);

router.delete("/:id", authMiddleware, shopsController.remove);

module.exports = router;
