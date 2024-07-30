"use strict";
const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");

const createTokenPair = ({ payload, privateKey }) => {
  try {
    // access token
    const accessToken = JWT.sign(payload, privateKey, {
      expiresIn: "2 days",
      algorithm: "RS256",
    });

    // refreshToken
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
      algorithm: "RS256",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const createCryptoKey = () => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs1",
      format: "pem",
    },
  });
  return { publicKey, privateKey };
};

const verifyJWT = (token, keySecret, options = {}) => {
  return JWT.verify(token, keySecret, {
    algorithms: ["RS256"],
    ...options,
  });
};

module.exports = {
  createTokenPair,
  createCryptoKey,
  verifyJWT,
};
