const express = require("express");
const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const path = require('path');
const rootPath = path.resolve(__dirname);
require('module-alias/register');
require('module-alias').addAlias('@', rootPath);

const cors = require("cors");
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const routes = require("./routes");
app.use("/", routes);

module.exports = app;
