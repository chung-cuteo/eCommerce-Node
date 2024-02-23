"use strict";

const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();

// check apiKey
router.use(apiKey)
router.use(permission('0000'))

// check permission

// router
router.use("/v1/api", require('./access'));

module.exports = router;
