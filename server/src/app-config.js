const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");

require("module-alias/register");
require("module-alias").addAlias("@", path.resolve(__dirname));

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const routes = require("./routes");
app.use("/", routes);

module.exports = app;
