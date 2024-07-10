"use strict";

const { CommentModel } = require("../models/comment.model");
const { convertToObjectIDMongodb } = require("../utils");

/*
 features
  + add comment [User/ Shop]
  + get list comment [User/ Shop]
  + delete comment [User/ Shop / admin]
*/

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId = null,
  }) {
    const comment = new CommentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;

    if (parentCommentId) {
      // reply
    } else {
      const maxRightValue = await CommentModel.findOne(
        {
          comment_productId: convertToObjectIDMongodb(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.right + 1;
      } else {
        rightValue = 1;
      }
    }

    // inset comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
  }
}

module.exports = CommentService;
