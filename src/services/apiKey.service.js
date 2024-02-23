"use strict";

const crypto = require("node:crypto");
const apiKeyModel = require("../models/apiKey.model");

class ApiKeyService {
  static async findByID(key) {
    // const newkey = await apiKeyModel.create({
    //   key: crypto.randomBytes(64).toString("hex"),
    //   permissions: ["0000"],
    // });
    return await apiKeyModel.findOne({ key, status: true }).lean();
  }
}

module.exports = ApiKeyService;
