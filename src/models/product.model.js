"use strict";

const { model, Schema } = require("mongoose");

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
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      enum: ["Electronic", "Clothing", "Furniture"],
      required: true,
    },
    product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_PRODUCT_NAME,
  }
);

// define the product type = Clothing
const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}
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
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}
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
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop'}
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
