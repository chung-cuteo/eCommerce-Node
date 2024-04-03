const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const { createTokenPair } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { getInfoData } = require("../utils");
const { BadResquestError } = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async signup({ name, email, password }) {
    // step 1: check exit emall
    const holdelShop = await shopModel.findOne({ email }).lean();
    if (holdelShop) {
      throw new BadResquestError("Error: Shop already registered !");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    if (!passwordHash) {
      throw new BadResquestError("Error: Password invalid !");
    }

    // tao 1 shop
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // tao privateKey , publicKey
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");

      // update  privateKey , publicKey token vao db
      const keyStore = await KeyTokenService.createKeyToken({
        userID: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadResquestError("Error: Token invalid !");
      }

      // tao token pair
      const tokens = await createTokenPair(
        {
          userID: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );

      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  }
}

module.exports = AccessService;
