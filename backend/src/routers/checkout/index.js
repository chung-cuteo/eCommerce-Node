"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const CheckoutController = require("../../controllers/checkout.controller");

// co can login khong tuy thuoc ycau cua du an
// router.use(authentication)

router.post("/review", asyncHandler(CheckoutController.checkoutReview));

module.exports = router;
