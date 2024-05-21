"use strict";

const express = require("express");
const router = express.Router();

const { apiKey, permission } = require("../auth/checkAuth");

// check apiKey dam bao an toan cho api
router.use(apiKey);
// check permission
router.use(permission("0000"));

// router
router.use("/v1/api/checkout", require("./checkout"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/discount", require("./discount"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/auth", require("./access"));

module.exports = router;
