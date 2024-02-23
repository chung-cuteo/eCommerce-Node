"use strict";

const ApiKeyService = require("../services/apiKey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

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

module.exports = { apiKey, permission };
