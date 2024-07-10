"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const CommentService = require("../services/comment.service");

class CommentController {
  // create
  static async createComment(req, res) {
    new Created({
      message: "Create new Cart success",
      metadata: await CommentService.createComment(req.body),
    }).send(res);
  }
}

module.exports = CommentController;
