"use strict";

const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");

// check authentication before below router here , new pass chuyen keyStore xuong cho router duoi
router.use(authentication);

router.post("/product/create", asyncHandler(ProductController.createProduct));

module.exports = router;
