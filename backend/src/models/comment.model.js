"use strict";

const { model, Schema } = require("mongoose");
const ObjectId = Schema.Types.ObjectId;

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "comments";

const commentSchema = new Schema(
  {
    comment_productId: {
      type: ObjectId,
      ref: "Product",
    },
    comment_userId: {
      type: Number,
      default: 1,
    },
    comment_content: {
      type: String,
      default: "text",
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: ObjectId,
      ref: DOCUMENT_NAME,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = { CommentModel: model(DOCUMENT_NAME, commentSchema) };
