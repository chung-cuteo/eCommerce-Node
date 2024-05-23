"use strict";

const { model, Schema } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "orders";

const orderSchema = new Schema(
  {
    order_userID: {
      type: Number,
      required: true,
    },
    order_checkout: {
      type: Object, // { total_price, total_apply_discount, free_ship}
      default: {},
    },
    order_shipping: {
      type: Object, // { street, city, state, country}
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      required: true,
    },
    order_tracking: {
      type: String,
      default: "#00000032323",
    },
    order_status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { OrderModel: model(DOCUMENT_NAME, orderSchema) };
