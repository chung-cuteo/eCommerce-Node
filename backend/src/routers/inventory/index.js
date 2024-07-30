"use strict";

const express = require("express");
const router = express.Router();
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
const InventoryController = require("../../controllers/inventory.controller");

// authen
router.use(authentication);

router.post("/", asyncHandler(InventoryController.addStockToInventory));

module.exports = router;
