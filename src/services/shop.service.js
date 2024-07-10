const { ShopModel } = require("../models/shop.model");

const findShopByEmail = async ({
  email,
  select = {
    email: 1,
    password: 2,
    name: 1,
    status: 1,
    roles: 1,
  },
}) => {
  return await ShopModel.findOne({ email: email }).select(select).lean();
};

module.exports = {
  findShopByEmail,
};
