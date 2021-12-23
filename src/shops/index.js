const express = require("express");
const router = express.Router();
const shopsController = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.post(
    "/",
    authMiddleware,
    upload.single('image'),
    shopsController.create
);

router.put(
    "/:id",
    authMiddleware,
    upload.single('image'),
    shopsController.update
);

router.get(
    "/",
    authMiddleware,
    shopsController.getAll
)

router.get(
    "/:id",
    authMiddleware,
    shopsController.getOne
)

router.delete(
    "/:id",
    authMiddleware,
    shopsController.remove
)

module.exports = router;