"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Key";
const COLECTION_NAME = "Keys";

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
  refreshToken: {
    type: Array,
    default: []
  }
}, {
  timestamps: true,
  collection: COLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
