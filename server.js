const express = require("express");
const cors = require("cors");
const axios = require("axios");
var schedule = require("node-schedule");
const { v4: uuidv4 } = require("uuid");

const router = require("./router");
const config = require("./src/config/config");
const currencyModel = require("./src/currency/model");
const commonModel = require("./src/common/common");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use("/", router);

const rule = new schedule.RecurrenceRule();
rule.hour = 12;

schedule.scheduleJob(rule, () => {
  axios
    .get(
      "http://api.currencylayer.com/live?access_key=b4eb98e1646afb0b3acfd691c2974dc9"
    )
    .then(async (response) => {
      const data = {
        id: uuidv4(),
        currencyDetails: [response.data.quotes],
      };
      await commonModel.tryBlock(
        data,
        "(UserCountryCurrency:update)",
        currencyModel.updateCurrency
      );
      return true;
    })
    .catch((err) => {
      console.log("err", err);
    });
});

app.listen(config.app.port, async () => {
  try {
    console.log(`Gini API listening on port ${config.app.port}!`);
    await commonModel.dbInit();
    console.log("All tables created successfully");
  } catch (error) {
    console.log("app.listen error", error);
  }
});

module.exports = app;
