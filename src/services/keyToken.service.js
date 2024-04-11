"use strict";

const { Types } = require("mongoose");
const ObjectId = Types.ObjectId;
const KeyTokenModel = require("../models/keyToken.model");
class KeyTokenService {
  static async createKeyToken({ userID, publicKey, privateKey, refreshToken }) {
    try {
      const query = { user: userID };

      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const tokens = await KeyTokenModel.findOneAndUpdate(
        query,
        update,
        options
      );
      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static async findByUserID(userID) {
    return await KeyTokenModel.findOne({ user: new ObjectId(userID) }).lean();
  }

  static async removeKeyByID(id) {
    return await KeyTokenModel.deleteOne(id);
  }
}

module.exports = KeyTokenService;
