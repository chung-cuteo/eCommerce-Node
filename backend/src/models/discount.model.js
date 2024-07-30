"use strict";

const { model, Schema } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "discounts";

const discountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      default: "fixed_amount", // percentage
    },
    discount_value: {
      type: Number, // 10.000, 10
      required: true,
    },
    discount_code: {
      type: String, // discount code
      required: true,
    },
    discount_start_date: {
      type: Date, // ngay bat dau
      required: true,
    },
    discount_end_date: {
      type: Date, // ngay ket thuc
      required: true,
    },
    discount_max_uses: {
      type: Number, // so luong discount duoc ap dung
      required: true,
    },
    discount_uses_count: {
      type: Number, // so luong discount da su dung
      required: true,
    },
    discount_users_used: {
      type: Array, // ai da su dung
      default: [],
    },
    discount_max_uses_per_user: {
      type: Number, // so luong discount cho phep toi da su dung doi voi 1 user
      required: true,
    },
    discount_min_order_value: {
      type: Number,
      required: true,
    },
    discount_max_value: {
      type: Number,
      required: true,
    },
    discount_shopID: {
      type: ObjectId,
      ref: "Shop",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      default: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      type: Array,
      default: [], // so luong san pham duoc ap dung
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { DiscountModel: model(DOCUMENT_NAME, discountSchema) };
