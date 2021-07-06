const express = require("express");
const cors = require("cors");
const config = require("./src/config/config");
const app = express();
const router = require("./router");
var schedule = require("node-schedule");
const axios = require("axios");
const { v4: uuidv4 } = require('uuid');

const currencyModel = require("./src/currency/model");
const commonModel = require("./src/common/common");

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
      }
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

app.listen(config.app.port, () => {
   console.log(`Example app listening on port ${config.app.port}!`);
});
