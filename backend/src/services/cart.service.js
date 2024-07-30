"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const { CartModel } = require("../models/cart.model");
const {
  createUserCart,
  updateUserCartQuantity,
  deleteUserCartItem,
  getListUserCart,
} = require("../models/repositories/cart.repo");
const { getProductByID } = require("../models/repositories/product.repo");

/*
key feature
- add product to cart [user]
- reduce product quantity by one [user]
- increase, decrease product quantity by one [user]
- get cart [user]
- delete cart [user]
- delete cart item [user]
*/

class CartService {
  // add cart
  static async addToCart({ userID, product = {} }) {
    // check cart ton tai khong
    const userCart = await CartModel.findOne({
      cart_userID: userID,
    });

    const foundProduct = await getProductByID(product.productID);
    if (!foundProduct) throw new NotFoundError("Not found product");

    const createProductData = {
      ...product,
      name: foundProduct.product_name,
      price: foundProduct.product_price,
    };

    if (!userCart) {
      // create cart for User
      return createUserCart({ userID, createProductData });
    }

    // neu co gio hang roi nhung chua co san pham
    if (!userCart.cart_products.length) {
      userCart.cart_products = [createProductData];
      return await userCart.save();
    }

    // gio hang ton tai , va co san pham nay thi update quantity
    return await updateUserCartQuantity({ userID, product });
  }

  // update cart
  /*
  shop_order_ids: [
    {
      shopID,
      item_products: [
        {
          quantity: 
          price: 
          shopID,
          old_quantity
          productID
        }
      ],
      version: xx
    }
  ]
  */

  static async updateToCart({ userID, shop_order_ids }) {
    const { productID, quantity, shopID, old_quantity } =
      shop_order_ids[0]?.item_products[0];
    // check product
    const foundProduct = await getProductByID(productID);

    if (!foundProduct) throw new NotFoundError("Not found product");
    if (foundProduct.product_shop.toString() !== shopID) {
      throw new NotFoundError("Not do not belong to the shop");
    }
    if (quantity === 0) {
      // delete
    }

    return await updateUserCartQuantity({
      userID,
      product: {
        productID,
        quantity: quantity - old_quantity,
      },
    });
  }

  // delete
  static async deleteUserCartItem({ userID, productID }) {
    await deleteUserCartItem({ userID, productID });
  }

  // get cart
  static async getListUserCart({ userID }) {
    return await getListUserCart({ userID });
  }
}

module.exports = CartService;
