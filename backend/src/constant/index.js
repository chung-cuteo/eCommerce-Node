const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-refresh-token",
};

const ROLES_SHOP = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

const NOTIFICATION_TYPE = {
  ORDER_001: "ORDER-001", // order success
  ORDER_002: "ORDER-002", // order failed
  PROMOTION_001: "PROMOTION-001", // co 1 khuyen mai moi
  SHOP_001: "SHOP-001", // co 1 san pham moi duoc ban danh cho user follow
};

module.exports = {
  HEADER,
  ROLES_SHOP,
  NOTIFICATION_TYPE,
};
