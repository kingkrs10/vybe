const express = require("express");
const router = express.Router();
const userRouter = require('./src/users');
const offersRouter = require('./src/offers');

router.use('/users', userRouter);
router.use('/offers', offersRouter);

module.exports = router;