const express = require('express')
const router = express.Router()
const serviceController = require('./controller')
const { authMiddleware, upload} = require('../common/common');

router.post(
  "/",
  authMiddleware,
  serviceController.create
);

router.put(
  "/:id",
  authMiddleware,
  serviceController.update
);

router.get(
  "/",
  authMiddleware,
  serviceController.getAll
);

router.get(
  "/:id",
  authMiddleware,
  serviceController.getOne
);

router.delete(
  "/:id",
  authMiddleware,
  serviceController.remove
);

module.exports = router;