const express = require("express");
const router = express.Router();
const usersCountryCurrencyController = require("./controller");
const { authMiddleware } = require('../common/common');

router.post(
    "/",
    authMiddleware,
    usersCountryCurrencyController.create
);

router.put(
    "/:id",
    authMiddleware,
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
