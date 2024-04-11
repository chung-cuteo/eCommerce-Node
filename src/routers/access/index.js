"use strict";

const express = require("express");
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const router = express.Router();

// signup
router.post("/shop/signup", asyncHandler(AccessController.signup));
// login
router.post("/shop/login", asyncHandler(AccessController.login));

// check authentication before logout here , new pass chuyen keyStore xuong cho logout
router.use(authentication);
router.post("/shop/logout", asyncHandler(AccessController.logout));

// logout

module.exports = router;
