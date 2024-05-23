"use strict";

const { BadRequestError } = require("../core/error.response");
const { InventoryModel } = require("../models/inventory.model");
const { getProductByID } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productID,
    shopID,
    location = "tokyo japan",
  }) {
    const product = await getProductByID(productID);

    if (!product) throw new BadRequestError("the product not exist");

    const query = { inventory_shopID: shopID, inventory_productID: productID };
    const updateSet = {
      $inc: {
        inventory_stock: stock,
      },
      $set: {
        inventory_location: location,
      },
    };
    const options = { upsert: true, new: true };

    return await InventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

module.exports = InventoryService;
