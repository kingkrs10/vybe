// var fs = require("fs");
var config;
// TO DO : Make it using URL based
if (process.env.NODE_ENV === "development") {
  config = require("./dev.js");
} else {
  config = require("./produdction.js");
}

module.exports = config;
