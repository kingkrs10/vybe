const express = require("express");
const router = express.Router();
const Controller = require("./controller");
const { authMiddleware, upload} = require('../common/common');

router.get(
    "/",
    authMiddleware,
    Controller.getAllCategories
)

router.get(
    "/:keyCode",
    authMiddleware,
    Controller.getCategoryItems
)

router.post(
    "/subCategories",
    authMiddleware,
    Controller.getSubCategoryItems
)

module.exports = router;