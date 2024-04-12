"use strict";
const { model, Schema } = require("mongoose");
const slugify = require("slugify");
const ObjectId = Schema.Types.ObjectId;
const Mixed = Schema.Types.Mixed;

const DOCUMENT_PRODUCT_NAME = "Product";
const COLLECTION_PRODUCT_NAME = "Products";
const DOCUMENT_ClOTHING_NAME = "Clothing";
const COLLECTION_ClOTHING_NAME = "Clothings";
const DOCUMENT_ELECTRONIC_NAME = "Electronic";
const COLLECTION_ELECTRONIC_NAME = "Electronics";
const DOCUMENT_FURNITURE_NAME = "Furniture";
const COLLECTION_FURNITURE_NAME = "Furnitures";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_price: {
      type: Number,
      required: true,
    },
    product_slug: String,
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      enum: ["Electronic", "Clothing", "Furniture"],
      required: true,
    },
    product_shop: { type: ObjectId, ref: "Shop" },
    product_attributes: {
      type: Mixed,
      required: true,
    },
    product_ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be above 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: true, index: true, select: false },
  },
  {
    timestamps: true,
    collection: COLLECTION_PRODUCT_NAME,
  }
);
// create Index
productSchema.index({
  product_name: "text",
  product_description: "text",
});
// document middleware: runs before .save and create ...
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

// define the product type = Clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: COLLECTION_ClOTHING_NAME,
  }
);

// define the product type = Electronic
const electronicSchema = new Schema(
  {
    manufacture: { type: String, required: true },
    model: String,
    color: String,
    product_shop: { type: ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: COLLECTION_ELECTRONIC_NAME,
  }
);

// define the product type = Furniture
const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: ObjectId, ref: "Shop" },
  },
  {
    timestamps: true,
    collection: COLLECTION_FURNITURE_NAME,
  }
);

module.exports = {
  ProductModel: model(DOCUMENT_PRODUCT_NAME, productSchema),
  ClothingModel: model(DOCUMENT_ClOTHING_NAME, clothingSchema),
  ElectronicModel: model(DOCUMENT_ELECTRONIC_NAME, electronicSchema),
  FurnitureModel: model(DOCUMENT_FURNITURE_NAME, furnitureSchema),
};
