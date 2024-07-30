"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const CartController = require("../../controllers/cart.controller");

router.post("/create", asyncHandler(CartController.addToCart));
router.post("/update", asyncHandler(CartController.updateToCart));
router.post(
  "/delete_item_cart",
  asyncHandler(CartController.deleteUserCartItem)
);
router.get("/", asyncHandler(CartController.getListUserCart));

module.exports = router;
