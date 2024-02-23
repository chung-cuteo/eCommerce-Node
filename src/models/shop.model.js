"use strict";
const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Shop";
const COLECTION_NAME = "Shops";

const shopSchema = new Schema({
  name: {
    type: String,
    trim: true,
    maxLength: 150,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },
  vertify: {
    type: Schema.Types.Boolean,
    default: true
  },
  roles: {
    type:Array,
    default: []
  },
}, {
  timestamps: true,
  collection: COLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, shopSchema);
