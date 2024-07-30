"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  // create
  static async addStockToInventory(req, res) {
    new Created({
      message: "Create new Cart success",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).send(res);
  }
}

module.exports = InventoryController;
