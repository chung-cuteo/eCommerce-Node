"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  // query get product
  static async findAllDraftForShop(req, res) {
    new SuccessResponse({
      message: "Get list Draft product success",
      metadata: await ProductService.findAllDraftForShop({
        product_shop: req.user.userID,
      }),
    }).send(res);
  }

  static async findAllPublishedForShop(req, res) {
    new SuccessResponse({
      message: "Get list Published product success",
      metadata: await ProductService.findAllPublishedForShop({
        product_shop: req.user.userID,
      }),
    }).send(res);
  }

  static async findAllSearchProduct(req, res) {
    new SuccessResponse({
      message: "Get list search Published product success",
      metadata: await ProductService.findAllSearchProduct(req.params),
    }).send(res);
  }

  static async findAllProducts(req, res) {
    new SuccessResponse({
      message: "Get list all Product success",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  }

  static async findOneProduct(req, res) {
    new SuccessResponse({
      message: "Get One Product success",
      metadata: await ProductService.findOneProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  }

  // create product
  static async createProduct(req, res) {
    new SuccessResponse({
      message: "Create product success",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userID,
      }),
    }).send(res);
  }

  // update product
  static async publishProductIDForShop(req, res) {
    new SuccessResponse({
      message: "Update publish product success",
      metadata: await ProductService.publishProductIDForShop({
        product_shop: req.user.userID,
        product_id: req.params.id,
      }),
    }).send(res);
  }

  static async unPublishProductIDForShop(req, res) {
    new SuccessResponse({
      message: "Update publish product success",
      metadata: await ProductService.unPublishProductIDForShop({
        product_shop: req.user.userID,
        product_id: req.params.id,
      }),
    }).send(res);
  }

  static async updateProduct(req, res) {
    new SuccessResponse({
      message: "Update product success",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.productID,
        {
          ...req.body,
          product_shop: req.user.userID,
        }
      ),
    }).send(res);
  }
}

module.exports = ProductController;
