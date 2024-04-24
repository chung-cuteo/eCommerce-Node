"use strict";
const {
  ProductModel,
  ClothingModel,
  ElectronicModel,
} = require("../models/product.model");
const { BadRequestError } = require("../core/error.response");
const {
  findAllDraftForShop,
  findAllPublishedForShop,
  publishProductIDForShop,
  searchProductByUser,
  findAllProducts,
  findOneProduct,
  updateProductByID,
} = require("../models/repositories/product.repo");
const { removeUndefinedObject, updateNestedObjectParser } = require("../utils");
const { insertInventory } = require("../models/repositories/inventory.repo");

// su dung factory patter
// define factory class Product
class ProductFactory {
  static productsRegister = {};

  static registerProductType(type, classRef) {
    ProductFactory.productsRegister[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productsRegister[type];
    if (!productClass)
      throw new BadRequestError("Invalid product Types::: " + type);

    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productID, payload) {
    const productClass = ProductFactory.productsRegister[type];
    if (!productClass)
      throw new BadRequestError("Invalid product Types::: " + type);

    return new productClass(payload).updateProduct(productID);
  }

  // query
  static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftForShop({ query, limit, skip });
  }

  static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublish: true };
    return await findAllPublishedForShop({ query, limit, skip });
  }

  static async findAllSearchProduct({ keySearch }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: [
        "product_name",
        "product_price",
        "product_thumb",
        "product_shop",
      ],
    });
  }

  static async findOneProduct({ product_id }) {
    return await findOneProduct({
      product_id,
      unSelect: ["__v", "product_variations"],
    });
  }

  // push
  static async publishProductIDForShop({ product_shop, product_id }) {
    return await publishProductIDForShop({ product_shop, product_id });
  }

  static async unPublishProductIDForShop({ product_shop, product_id }) {
    return await unPublishProductIDForShop({ product_shop, product_id });
  }
}

// define base Product class
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_quantity,
    product_price,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_quantity = product_quantity;
    this.product_price = product_price;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  // create new product
  async createProduct(product_id) {
    const newProduct = await ProductModel.create({
      ...this,
      _id: product_id,
    });

    if (newProduct) {
      //  add inventory_stock in inventory collection
      await insertInventory({
        productID: newProduct._id,
        shopID: newProduct.product_shop,
        stock: newProduct.product_quantity,
      });
    }

    return newProduct;
  }

  // update product
  async updateProduct(productID, updateBody) {
    return await updateProductByID({
      productID,
      payload: updateBody,
      model: ProductModel,
    });
  }
}

// define class Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await ClothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw new BadRequestError("Create new Clothing error");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new Clothing error");

    return newProduct;
  }

  async updateProduct(productID) {
    // 1 remove attr has null undefined

    if (this.product_attributes) {
      // update con
      await updateProductByID({
        productID,
        payload: updateNestedObjectParser(this.product_attributes),
        model: ClothingModel,
      });
    }

    const updateProduct = await super.updateProduct(
      productID,
      updateNestedObjectParser(this)
    );

    return updateProduct;
  }
}

// define class Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await ElectronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new Electronic error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new Electronic error");

    return newProduct;
  }
}

// define class FurnitureModel
class FurnitureModel extends Product {
  async createProduct() {
    const newFurnitureModel = await FurnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurnitureModel)
      throw new BadRequestError("Create new FurnitureModel error");

    const newProduct = await super.createProduct(newFurnitureModel._id);
    if (!newProduct)
      throw new BadRequestError("Create new FurnitureModel error");

    return newProduct;
  }
}

// register product types
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", FurnitureModel);

module.exports = ProductFactory;
