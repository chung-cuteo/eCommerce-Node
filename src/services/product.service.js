"use strict";

const {
  ProductModel,
  ClothingModel,
  ElectronicModel,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");

// define factory class Product
class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload);
        
        case "Electronic":
        return new Electronic(payload);

      default:
        throw new BadRequestError("Invalid product Types");
    }
  }
}

// define base Product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = new ProductModel({
      ...this,
      _id: product_id,
    });
    const createData = await newProduct.save();
    return createData;
  }
}

// define class Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = new ClothingModel({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    const createData = await newClothing.save();
    if (!createData) throw new BadRequestError("Create new Clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new Clothing error");

    return newProduct;
  }
}

// define class Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = ElectronicModel({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    const createData = await newElectronic.save();
    if (!createData)
    throw new BadRequestError("Create new Electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new Electronic error");

    return newProduct;
  }
}

module.exports = ProductFactory;
