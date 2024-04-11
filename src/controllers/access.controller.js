"use strict";
const { Created, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  static async logout(req, res) {
    new SuccessResponse({
      message: "Logout successes",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  }

  static async login(req, res) {
    new SuccessResponse({
      message: "Login successes",
      metadata: await AccessService.login(req.body),
    }).send(res);
  }

  static async signup(req, res) {
    new Created({
      message: "Registered Ok !",
      metadata: await AccessService.signup(req.body),
    }).send(res);
  }
}

module.exports = AccessController;
