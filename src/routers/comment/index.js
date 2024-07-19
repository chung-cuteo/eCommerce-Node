"use strict";

const express = require("express");
const router = express.Router();
const CommentController = require("../../controllers/comment.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");
// check authentication before below router here , new pass chuyen keyStore xuong cho router duoi
router.use(authentication);
//

router.post("", asyncHandler(CommentController.createComment));
router.get("", asyncHandler(CommentController.getCommentByParentId));
router.delete("", asyncHandler(CommentController.deleteComments));

module.exports = router;
