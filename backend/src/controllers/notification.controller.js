"use strict";

const { Created, SuccessResponse } = require("../core/success.response");
const Notification = require("../services/notification.service");

class NotificationController {
  static async listNotiByUser(req, res) {
    new SuccessResponse({
      message: "Get comments list success",
      metadata: await Notification.listNotiByUser(req.query),
    }).send(res);
  }
}

module.exports = NotificationController;
