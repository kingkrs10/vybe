const express = require("express");
const router = express.Router();
const loansController = require("./controller");
const { authMiddleware } = require("../common/common");

router.post("/", authMiddleware, loansController.create);

router.get("/all", authMiddleware, loansController.getAll);

router.patch("/:id", authMiddleware, loansController.update);

router.get("/:id", authMiddleware, loansController.getOne);

router.delete("/:id", authMiddleware, loansController.remove);

module.exports = router;
