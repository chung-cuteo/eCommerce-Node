"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  // create
  static async addToCart(req, res) {
    new Created({
      message: "Create new Cart success",
      metadata: await CartService.addToCart(req.body),
    }).send(res);
  }

  // update
  static async updateToCart(req, res) {
    new SuccessResponse({
      message: "Update Cart success",
      metadata: await CartService.updateToCart(req.body),
    }).send(res);
  }

  // delete cart item
  static async deleteUserCartItem(req, res) {
    new SuccessResponse({
      message: "Delete Cart success",
      metadata: await CartService.deleteUserCartItem(req.body),
    }).send(res);
  }

  // get list cart
  static async getListUserCart(req, res) {
    new SuccessResponse({
      message: "Get list Cart success",
      metadata: await CartService.getListUserCart(req.query),
    }).send(res);
  }
}

module.exports = CartController;
