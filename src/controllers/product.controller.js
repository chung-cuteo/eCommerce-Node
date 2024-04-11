"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  static async createProduct(req, res) {
    new SuccessResponse({
      message: "Create product success",
      metadata: await ProductService.createProduct(
        req.body.product_type,
        {
          ...res.body,
          product_shop: req.user.userID
        }
      ),
    }).send(res);
  }
}

module.exports = ProductController;
