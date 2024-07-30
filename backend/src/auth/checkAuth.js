"use strict";

const { verifyJWT } = require("./authUtils");
const ApiKeyService = require("../services/apiKey.service");
const { HEADER } = require("../constant/index");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserID } = require("../services/keyToken.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    // check objKey
    const objKey = await ApiKeyService.findByID(key);
    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    // gan objKey vao request cho cac lan tiep theo
    req.objKey = objKey;

    return next();
  } catch (error) {
    console.error(error);
  }
};

const permission = (permission) => {
  return (req, res, next) => {
    const validPermission = req.objKey.permissions.includes(permission);

    if (!req.objKey.permissions || !validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
   1- check userID co khong
   2- lay accessToken
   3- verify token
   4- check user trong db
   5- check keyStore voi userID
   - neu ok => cho next
  */

  //1
  const userID = req.headers[HEADER.CLIENT_ID];
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  const accessToken = req.headers[HEADER.AUTHORIZATION];

  if (!userID) throw new AuthFailureError("Invalid Request");
  const keyStore = await findByUserID(userID);

  if (!keyStore) throw new NotFoundError("Not found keyStore");
  // check refresh token when match router refresh token

  if (refreshToken && req.path === "/shop/refreshToken") {
    try {
      const decodeUser = verifyJWT(refreshToken, keyStore.publicKey);
      if (decodeUser.userID !== userID) {
        throw new AuthFailureError("Unauthorized");
      }
      req.keyStore = keyStore;
      req.user = decodeUser; // { userID, email}
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  //2
  if (!accessToken) throw new AuthFailureError("Unauthorized");
  //3
  try {
    const decodeUser = verifyJWT(accessToken, keyStore.publicKey);
    // 4 -5
    if (decodeUser.userID !== userID) {
      throw new AuthFailureError("Unauthorized");
    }
    req.keyStore = keyStore;
    req.user = decodeUser; // { userID, email}
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { apiKey, permission, authentication };
