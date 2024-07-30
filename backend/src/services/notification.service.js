"use strict";

const { NOTIFICATION_TYPE } = require("../constant");
const { NotificationModel } = require("../models/notification.model");
const { options } = require("../routers");

class Notification {
  static async pushNotiToSystem({
    type = NOTIFICATION_TYPE.SHOP_001,
    receivedId = 1,
    senderId = 1,
    options = {},
  }) {
    let notiContent;

    if (type === NOTIFICATION_TYPE.SHOP_001) {
      notiContent = "@@@ vua moi them 1 san pham: @@@";
    }

    if (type === NOTIFICATION_TYPE.PROMOTION_001) {
      notiContent = "@@@ vua moi them 1 giam gia: @@@";
    }

    if (type === NOTIFICATION_TYPE.ORDER_001) {
      notiContent = "@@@ order thanh cong: @@@";
    }

    if (type === NOTIFICATION_TYPE.ORDER_002) {
      notiContent = "@@@ order that bai: @@@";
    }

    const newNoti = await NotificationModel.create({
      noti_type: type,
      noti_senderId: senderId,
      noti_receivedId: receivedId,
      noti_content: notiContent,
      noti_options: options,
    });

    return newNoti;
  }

  static async listNotiByUser({ userId = 1, type = "ALL", isRead = 0 }) {
    const match = { noti_receivedId: userId };

    if (type !== "ALL") {
      match["noti_type"] = type;
    }

    return await NotificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          noti_type: 1,
          noti_senderId: 1,
          noti_receivedId: 1,
          createdAt: 1,
          noti_options: 1,
        },
      },
    ]);
  }
}

module.exports = Notification;
