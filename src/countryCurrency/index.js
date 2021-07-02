const express = require("express");
const router = express.Router();
const usersCountryCurrencyController = require("./controller");
const { authMiddleware, upload } = require('../common/common');

router.post(
    "/",
    authMiddleware,
    upload.none(),
    usersCountryCurrencyController.create
);

router.put(
    "/:id",
    authMiddleware,
    upload.none(),
    usersCountryCurrencyController.update
);

router.get(
    "/:id",
    authMiddleware,
    usersCountryCurrencyController.getUserCountryCurrency
);

router.delete(
    "/:uid/:currency",
    authMiddleware,
    usersCountryCurrencyController.remove
);

module.exports = router;
