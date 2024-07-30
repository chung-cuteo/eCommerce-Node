"use strict";

const express = require("express");
const router = express.Router();
const { authentication } = require("../../auth/checkAuth");
const asyncHandler = require("../../helpers/asyncHandler");
const DiscountController = require("../../controllers/discount.controller");

router.post("/amount", asyncHandler(DiscountController.getDiscountAmount));
router.get(
  "/list_product_code",
  asyncHandler(DiscountController.getAllDiscountCodesWithProduct)
);

// check authentication before below router here , new pass chuyen keyStore xuong cho router duoi
router.use(authentication);
//

router.post("/create", asyncHandler(DiscountController.createDiscountCode));
router.get(
  "/list_shop_code",
  asyncHandler(DiscountController.getAllDiscountCodesByShop)
);

module.exports = router;
