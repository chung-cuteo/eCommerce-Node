"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  // create
  static async createComment(req, res) {
    new Created({
      message: "Create new comment success",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  }

  static async getCommentByParentId(req, res) {
    new SuccessResponse({
      message: "Get comments list success",
      metadata: await CommentService.getCommentByParentId(req.query),
    }).send(res);
  }

  static async deleteComments(req, res) {
    new SuccessResponse({
      message: "Delete comments success",
      metadata: await CommentService.deleteComments(req.body),
    }).send(res);
  }
}

module.exports = CommentController;
