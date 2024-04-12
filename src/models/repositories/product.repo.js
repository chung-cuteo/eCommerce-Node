"use strict";

const { Types } = require("mongoose");
const { ProductModel, ClothingModel } = require("../product.model");

//common func
const queryProduct = async ({ query, limit, skip }) => {
  return await ProductModel.find(query)
    .populate("product_shop", "name email _id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

// query
const findAllDraftForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedForShop = async ({ query, limit, skip }) => {
  return await queryProduct({ query, limit, skip });
};

const searchProductByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  return await ProductModel.find(
    {
      isDraft: false,
      $text: { $search: regexSearch },
    },
    {
      score: { $meta: "textScore" },
    }
  )
    .sort({ score: { $meta: "textScore" } })
    .lean();
};

//put
const publishProductIDForShop = async ({ product_shop, product_id }) => {
  const foundShop = ProductModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductIDForShop = async ({ product_shop, product_id }) => {
  const foundShop = ProductModel.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

module.exports = {
  findAllDraftForShop,
  findAllPublishedForShop,
  publishProductIDForShop,
  unPublishProductIDForShop,
  searchProductByUser,
};
