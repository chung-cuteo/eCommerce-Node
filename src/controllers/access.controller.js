"use strict";
const AccessService = require("../services/access.service");

class AccessController {
  static async signup(req, res, next) {
    return res.status(201).json(await AccessService.signup(req.body));
  }
}

module.exports = AccessController;
