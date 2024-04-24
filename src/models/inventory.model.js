"use strict";

const { model, Schema } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "inventories";

const inventorySchema = new Schema(
  {
    inventory_productID: {
      type: ObjectId,
      ref: "Product",
    },
    inventory_location: {
      type: String,
      default: "unKnow",
    },
    inventory_stock: {
      type: Number,
      required: true,
    },
    inventory_shopID: {
      type: ObjectId,
      ref: "Shop",
    },
    inventory_reservations: {
      // hang dat trk
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { InventoryModel: model(DOCUMENT_NAME, inventorySchema) };
