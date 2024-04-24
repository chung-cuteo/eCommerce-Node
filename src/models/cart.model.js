"use strict";

const { model, Schema } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [], // [{productID:, shopID:, quantity:, name:, price:}]
    },
    cart_count_product: {
      type: Number,
      default: 0,
    },
    cart_userID: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { CartModel: model(DOCUMENT_NAME, cartSchema) };
