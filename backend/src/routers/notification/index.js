"use strict";

const express = require("express");
const router = express.Router();
const NotificationController = require("../../controllers/notification.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");

// router danh cho niti ko can login
//this here

// check authentication before below router here , new pass chuyen keyStore xuong cho router duoi
router.use(authentication);
//

router.get("", asyncHandler(NotificationController.listNotiByUser));

module.exports = router;
