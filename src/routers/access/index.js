"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const router = express.Router();

// signup
router.post('/shop/signup', AccessController.signup)

module.exports = router;
