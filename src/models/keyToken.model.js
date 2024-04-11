"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "KeyToken";
const COLLECTION_NAME = "KeyTokens";

const keyTokenSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Shop'
  },
  publicKey: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  refreshTokensUsed: { // nhung token da su dung
    type: Array,
    default: []
  },
  refreshToken: { // token dang dk su dung
    type: String,
    require: true
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
