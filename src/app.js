require("dotenv").config();
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { checkOverload } = require("./helpers/check.connect");
const router = require("./routers");
const app = express();

//init midlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//init db
require("./databases/init.mongodb");
// checkOverload();

//init router
app.use(router);

//init handle error

module.exports = app;
