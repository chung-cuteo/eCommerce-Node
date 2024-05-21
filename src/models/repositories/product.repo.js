"use strict";

const { ProductModel } = require("../product.model");
const {
  getSelectData,
  unGetSelectData,
  convertToObjectIDMongodb,
} = require("../../utils");

//common func
const queryProduct = async ({ query, limit = 50, skip }) => {
  return await ProductModel.find(query)
    .populate("product_shop", "name email _id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

// query get
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

const findAllProducts = async ({
  limit = 50,
  sort = "ctime",
  page = 1,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const products = await ProductModel.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findOneProduct = async ({ product_id, unSelect }) => {
  return await ProductModel.findById(product_id).select(
    unGetSelectData(unSelect)
  );
};

// update
const publishProductIDForShop = async ({ product_shop, product_id }) => {
  const foundShop = ProductModel.findOne({
    product_shop: convertToObjectIDMongodb(product_shop),
    _id: convertToObjectIDMongodb(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unPublishProductIDForShop = async ({ product_shop, product_id }) => {
  const foundShop = ProductModel.findOne({
    product_shop: convertToObjectIDMongodb(product_shop),
    _id: convertToObjectIDMongodb(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const updateProductByID = async ({
  productID,
  payload,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productID, payload, {
    new: isNew,
  });
};

const getProductByID = async (productID) => {
  return await ProductModel.findOne({
    _id: convertToObjectIDMongodb(productID),
  }).lean();
};

const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductByID(product.productID);
      if (foundProduct) {
        return {
          price: foundProduct.product_price,
          quantity: foundProduct.product_quantity,
          productID: foundProduct._id,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftForShop,
  findAllPublishedForShop,
  publishProductIDForShop,
  unPublishProductIDForShop,
  searchProductByUser,
  findAllProducts,
  findOneProduct,
  updateProductByID,
  getProductByID,
  checkProductByServer,
};
