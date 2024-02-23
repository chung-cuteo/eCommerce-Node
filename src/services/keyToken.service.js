"use strict";

const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  static async createKeyToken({ userID, publicKey, privateKey }) {
    try {
      const tokens = await keyTokenModel.create({
        user: userID,
        publicKey,
        privateKey,
      });

      return tokens ? tokens : null
    } catch (error) {
      return error;
    }
  }
}

module.exports = KeyTokenService;
