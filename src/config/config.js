var fs = require("fs");
var config = require("./production.js");
// TO DO : Make it using URL based
if (fs.existsSync(__dirname + "/dev.js")) {
    config = require("./dev.js");
}

module.exports = config;
