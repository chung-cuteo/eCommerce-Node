"use strict";

const express = require("express");
const router = express.Router();

const { apiKey, permission } = require("../auth/checkAuth");

// check apiKey dam bao an toan cho api
router.use(apiKey);
// check permission
router.use(permission("0000"));

// router
router.use("/v1/api/auth", require("./access"));
router.use("/v1/api/product", require("./product"));

module.exports = router;
