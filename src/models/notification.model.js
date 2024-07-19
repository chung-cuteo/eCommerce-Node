"use strict";

const { model, Schema } = require("mongoose");
const { NOTIFICATION_TYPE } = require("../constant");
const ObjectId = Schema.Types.ObjectId;

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "notifications";

const notificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: [
        NOTIFICATION_TYPE.ORDER_001,
        NOTIFICATION_TYPE.ORDER_001,
        NOTIFICATION_TYPE.PROMOTION_001,
        NOTIFICATION_TYPE.SHOP_001,
      ],
      required: true,
    },
    noti_senderId: { type: ObjectId, required: true, ref: "Shop" },
    noti_receivedId: { type: Number, required: true },
    noti_content: { type: String, required: true },
    noti_options: { type: Object, default: {} },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = {
  NotificationModel: model(DOCUMENT_NAME, notificationSchema),
};
