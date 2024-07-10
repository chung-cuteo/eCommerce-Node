"use strict";

const crypto = require("node:crypto");
const { APIKeyModel } = require("../models/apiKey.model");

class ApiKeyService {
  static async findByID(key) {
    // key nay do ben thu 3 cung cap
    const newkey = await APIKeyModel.create({
      key: crypto.randomBytes(64).toString("hex"),
      permissions: ["0000"],
    });
    return await APIKeyModel.findOne({ key, status: true }).lean();
  }
}

module.exports = ApiKeyService;
