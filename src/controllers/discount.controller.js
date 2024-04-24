"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  // create
  static async createDiscountCode(req, res) {
    new SuccessResponse({
      message: "Create Discount success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopID: req.user.userID,
      }),
    }).send(res);
  }

  // get all discount code => danh cho shop/ admin
  static async getAllDiscountCodesByShop(req, res) {
    new SuccessResponse({
      message: "Get Discount code by shop success",
      metadata: await DiscountService.getAllDiscountCodesByShop({
        ...req.query,
        shopID: req.user.userID,
      }),
    }).send(res);
  }
  // danh cho user mua hang
  static async getAllDiscountCodesWithProduct(req, res) {
    new SuccessResponse({
      message: "Get Discount code by Product success",
      metadata: await DiscountService.getAllDiscountCodesWithProduct({
        ...req.query,
      }),
    }).send(res);
  }

  static async getDiscountAmount(req, res) {
    new SuccessResponse({
      message: "Get Discount amount success",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
      }),
    }).send(res);
  }

  // delete
}

module.exports = DiscountController;
