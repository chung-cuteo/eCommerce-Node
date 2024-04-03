"use strict";
const { Created } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  static async signup(req, res, next) {
    new Created ({
      message: 'Registered Ok !',
      metadata: await AccessService.signup(req.body)
    }).send(res)
  }
}

module.exports = AccessController;
