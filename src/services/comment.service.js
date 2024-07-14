"use strict";

const { NotFoundError } = require("../core/error.response");
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
      // reply comment

      const parentComment = await CommentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Parent comment not found");

      rightValue = parentComment.comment_right;
      // update comments

      await CommentModel.updateMany(
        {
          comment_productId: convertToObjectIDMongodb(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2, comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await CommentModel.findOne(
        {
          comment_productId: convertToObjectIDMongodb(productId),
        },
        { comment_right: 1 },
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // inset comment
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;

    await comment.save();
    return comment;
  }

  static async getCommentByParentId({
    productId,
    parentCommentId = null,
    limit = 50,
    offset = 0, // skip
  }) {
    if (parentCommentId) {
      const parentComment = await CommentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Not found parent comment");

      const comments = await CommentModel.find({
        comment_productId: convertToObjectIDMongodb(productId),
        comment_left: { $gt: parentComment.comment_left },
        comment_right: { $lte: parentComment.comment_right },
      }).sort({
        comment_left: 1,
      });

      return comments;
    }

    const comments = await CommentModel.find({
      comment_productId: convertToObjectIDMongodb(productId),
      comment_parentId: null,
    }).sort({
      comment_left: 1,
    });

    return comments;
  }
}

module.exports = CommentService;
