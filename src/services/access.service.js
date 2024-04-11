const Shop = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const {
  createTokenPair,
  createCryptoKey,
  verifyJWT,
} = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { findShopByEmail } = require("./shop.service");
const { ROLES_SHOP } = require("../constant/index");

class AccessService {
  static async refreshToken({ refreshToken, user, keyStore }) {
    const { userID, email } = user;
    const isUsedRefreshToken = keyStore.refreshTokensUsed.includes(refreshToken);

    if (isUsedRefreshToken) {
      await KeyTokenService.deleteKeyByID(userID);
      throw new ForbiddenError("Something wrong happen !! Please re login");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered");

    // check exist shop
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // create 1 cap token voi private, public key cu trong db
    const tokens = await createTokenPair({
      payload: { userID, email },
      privateKey: keyStore.privateKey,
    });

    // update token
    await KeyTokenService.updateKey(
      { refreshToken },
      {
        refreshToken: tokens.refreshToken,
        refreshTokensUsed: refreshToken,
      }
    );

    return {
      user,
      tokens,
    };
  }

  static async logout(keyStore) {
    const removeKey = await KeyTokenService.removeKeyByID(keyStore._id);
    return removeKey;
  }

  /*
  1- check email in db
  2- match password
  3- create access token vs refresh token
  4- general token
  5- get data return login
  */
  static async login({ email, password, refreshToken = null }) {
    //1.
    const foundShop = await findShopByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not register");
    // 2.
    const isCheckPassword = bcrypt.compare(password, foundShop.password);
    if (!isCheckPassword) throw new AuthFailureError("Authentication error");

    //3.create access token vs refresh token by publickey and private key
    const { publicKey, privateKey } = createCryptoKey();

    // 4
    const { _id: userID } = foundShop;
    const tokens = await createTokenPair({
      payload: {
        userID,
        email,
      },
      privateKey,
    });

    // add refreshToken and privateKey , publicKey token vao db
    const createdKeyToken = await KeyTokenService.createKeyToken({
      privateKey,
      publicKey,
      refreshToken: tokens.refreshToken,
      userID,
    });

    if (!createdKeyToken) throw new BadRequestError("Can not save token");

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  }

  static async signup({ name, email, password }) {
    // step 1: check exit email
    const holderShop = await ShopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already registered !");
    }

    // tao 1 shop
    const newShop = await ShopModel.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      roles: [ROLES_SHOP.SHOP],
    });
    if (!newShop) return null;

    // tao privateKey , publicKey
    const { publicKey, privateKey } = createCryptoKey();

    // add privateKey , publicKey token vao db
    const createdKeyToken = await KeyTokenService.createKeyToken({
      userID: newShop._id,
      publicKey,
      privateKey,
    });

    if (!createdKeyToken) throw new BadRequestError("Can not save token");

    // tao token pair
    const tokens = await createTokenPair({
      payload: {
        userID: newShop._id,
        email,
      },
      privateKey,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: newShop,
      }),
      tokens,
    };
  }
}

module.exports = AccessService;
