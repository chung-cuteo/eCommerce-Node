const { CartModel } = require("../cart.model");
const { convertToObjectIDMongodb } = require("../../utils/index");

// create cart
const createUserCart = async ({ userID, product }) => {
  const query = { cart_userID: userID, cart_state: "active" };
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
  };
  const options = {
    upsert: true,
    new: true,
  };
  return await CartModel.findOneAndUpdate(query, updateOrInsert, options);
};

// update cart
const updateUserCartQuantity = async ({ userID, product }) => {
  const { productID, quantity } = product;
  const query = {
    cart_userID: userID,
    "cart_products.productID": productID,
    cart_state: "active",
  };
  const updateSet = {
    $inc: {
      "cart_products.$.quantity": quantity,
    },
  };
  const options = {
    upsert: true,
    new: true,
  };
  return await CartModel.findOneAndUpdate(query, updateSet, options);
};

// delete cart
const deleteUserCartItem = async ({ userID, productID }) => {
  const query = { cart_userID: userID, cart_state: "active" };
  const updateSet = {
    $pull: {
      cart_products: {
        productID,
      },
    },
  };

  return await CartModel.updateOne(query, updateSet);
};

// get list cart
const getListUserCart = async ({ userID }) => {
  return await CartModel.find({
    cart_userID: userID,
  }).lean();
};

const findCartByID = async (cartID) => {
  return await CartModel.findOne({
    _id: convertToObjectIDMongodb(cartID),
    cart_state: "active",
  }).lean();
};

module.exports = {
  createUserCart,
  updateUserCartQuantity,
  deleteUserCartItem,
  getListUserCart,
  findCartByID,
};
