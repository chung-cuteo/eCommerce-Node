"use strict";

const { BadRequestError } = require("../core/error.response");
const { findCartByID } = require("../models/repositories/cart.repo");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("../services/discount.service");

class CheckoutService {
  /* payload from FE
    cartID,
    userID,
    shop_order_ids: [
       shopID,
       shop_discounts: [
        {
         shopID,
         discountID,
         codeID
        }
       ],
       item_products: [
        {
          price,
          quantity,
          productID
        }
       ]
    ]
  */
  static async checkoutReview({ cartID, userID, shop_order_ids = [] }) {
    // check cartID is exist
    const foundCart = await findCartByID(cartID);

    if (!foundCart) throw new BadRequestError("Cart not exits");

    const checkout_order = {
      totalPrice: 0, // tong tien hang
      freeShip: 0, // phi van chuyen
      totalDiscount: 0, // tong tien discounts
      totalCheckout: 0, // tong tien thanh toan
    };

    const shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const {
        shopID,
        shop_discounts = [],
        item_products = [],
      } = shop_order_ids[i];

      const checkProductServer = await checkProductByServer(item_products); // check product co hop le khong

      if (!checkProductServer[0]) throw new BadRequestError("Order wrong");

      const checkoutPrice = checkProductServer.reduce((acc, product) => {
        // tong tien price
        return acc + product.price * product.quantity;
      }, 0);

      checkout_order.totalPrice += checkoutPrice;

      const itemCheckout = {
        shopID,
        shop_discounts,
        priceRaw: checkoutPrice, // trk khi giam gia,
        priceApplyDiscount: checkoutPrice,
        item_products: checkProductServer,
      };

      if (shop_discounts.length > 0) {
        // check xem discount co ton tai khong
        // lay amount cua 1 discount
        const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
          codeID: shop_discounts[0]?.codeID,
          userID,
          shopID,
          products: checkProductServer,
        });

        // tong cong discount giam gia
        checkout_order.totalDiscount += discount;

        // neu tien giam gia lon > 0
        if (discount > 0) {
          itemCheckout.priceApplyDiscount = checkoutPrice - discount;
        }
      }

      // tong thanh toan cuoi cung
      checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order,
    };
  }

  static async orderByUser({
    shop_order_ids,
    userID,
    user_address = {},
    user_payment = {},
  }) {
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({
        cartID,
        userID,
        shop_order_ids,
      });

    // check lai 1 lan nua xem qua luong ton kho hay khong ?

    const products = shop_order_ids_new.flatMap((order) => order.item_products);

    console.log("1::", products);

    for (let i = 0; i < products.length; i++) {
      const { productID, quantity } = products[i];
    }
  }
}

module.exports = CheckoutService;
