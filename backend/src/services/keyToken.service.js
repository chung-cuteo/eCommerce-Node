"use strict";

const { Types } = require("mongoose");
const ObjectId = Types.ObjectId;
const { KeyTokenModel } = require("../models/keyToken.model");
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
    return await KeyTokenModel.findOne({ user: new ObjectId(userID) });
  }

  static async removeKeyByID(id) {
    return await KeyTokenModel.deleteOne(id);
  }

  static async findByRefreshTokenUsed(refreshToken) {
    return await KeyTokenModel.findOne({
      refreshTokensUsed: refreshToken,
    }).lean();
  }

  static async findByRefreshToken(refreshToken) {
    return await KeyTokenModel.findOne({ refreshToken }).lean();
  }

  static async updateKey(filter, update) {
    return await KeyTokenModel.updateOne(filter, update);
  }

  static async deleteKeyByID(userID) {
    return await KeyTokenModel.deleteOne({ user: new ObjectId(userID) });
  }
}

module.exports = KeyTokenService;
