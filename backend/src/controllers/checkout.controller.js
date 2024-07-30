"use strict";

const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  static async checkoutReview(req, res) {
    new SuccessResponse({
      message: "Checkout success",
      metadata: await CheckoutService.checkoutReview(req.body),
    }).send(res);
  }
}

module.exports = CheckoutController;
