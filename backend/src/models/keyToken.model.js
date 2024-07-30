"use strict";

const { model, Schema } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "keyTokens";

const keyTokenSchema = new Schema(
  {
    user: {
      type: ObjectId,
      required: true,
      ref: "Shop",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokensUsed: {
      // nhung token da su dung
      type: Array,
      default: [],
    },
    refreshToken: {
      // token dang dk su dung
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { KeyTokenModel: model(DOCUMENT_NAME, keyTokenSchema) };
