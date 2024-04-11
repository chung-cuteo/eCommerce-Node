"use strict";

const JWT = require("jsonwebtoken");
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
  if (!userID) throw new AuthFailureError("Invalid Request");
  const keyStore = await findByUserID(userID);
  if (!keyStore) throw new NotFoundError("Not found keyStore");

  //2
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  //3
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey, {algorithms: ['RS256']});
    console.log(decodeUser);

    // 4 -5
    if (decodeUser.userID !== userID) {
      throw new AuthFailureError("Invalid User");
    }
    req.keyStore = keyStore;

    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = { apiKey, permission, authentication };
