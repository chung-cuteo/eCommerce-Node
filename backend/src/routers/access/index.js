"use strict";

const express = require("express");
const router = express.Router();
const AccessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");

// signup
router.post("/shop/signup", asyncHandler(AccessController.signup));
// login
router.post("/shop/login", asyncHandler(AccessController.login));

// check authentication before below router here , new pass chuyen keyStore xuong cho router duoi
router.use(authentication);

router.post("/shop/logout", asyncHandler(AccessController.logout));
router.post("/shop/refreshToken", asyncHandler(AccessController.refreshToken));

// logout

module.exports = router;
