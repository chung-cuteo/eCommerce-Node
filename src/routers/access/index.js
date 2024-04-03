"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();

// signup
router.post('/shop/signup', asyncHandler(AccessController.signup))

module.exports = router;
