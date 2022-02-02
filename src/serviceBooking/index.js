const express = require('express')
const router = express.Router()
const controller = require('./controller')
const { authMiddleware, upload} = require('../common/common');

router.post(
  "/",
  authMiddleware,
  controller.create
);

router.put(
  "/:id",
  authMiddleware,
  controller.update
);

router.get(
  "/:id",
  authMiddleware,
  controller.getOne
);

router.get(
  "/",
  authMiddleware,
  controller.getAll
);

router.post(
  "/updateStatus/:id",
  authMiddleware,
  controller.updateStatus
);

module.exports = router;