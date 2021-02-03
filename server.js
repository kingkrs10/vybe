const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const router = require("./router");
const config = require("./src/config/config");
const app = express();

// app.use(express.urlencoded({ extended: false }))
// app.use(express.json({ extended: false }))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// this will call for all the requests
app.use("/api/v1/", router);




app.listen(config.app.port, () => {
    console.log(`Example app listening on port ${config.app.port}!`)
});

