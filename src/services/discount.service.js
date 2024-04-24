"use strict";
const { filter } = require("lodash");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { DiscountModel } = require("../models/discount.model");
const {
  findAllDiscountCodesUnselect,
  checkExistDiscount,
} = require("../models/repositories/discount.repo");
const { findAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectIDMongodb } = require("../utils");
/*/
discount services
1- generator discount code by [Admin/ Shop]
2- get discount amount [ User]
3- get all discount code [ User/ Shop]
4- verify discount code [User]
5- Delete discount code [Admin/ Shop]
6- cancel discount code [User]
*/

class DiscountService {
  // create
  static async createDiscountCode(bodyRequest) {
    const {
      code,
      start_date,
      end_date,
      isActive,
      shopID,
      minOrderValue,
      productIds,
      appliesTo,
      name,
      description,
      type,
      value,
      usersUsed,
      maxValue,
      maxUses,
      usesCount,
      maxUsesPerUser,
    } = bodyRequest;

    // kiem tra
    if (Date.now() > new Date(end_date).getTime()) {
      throw new BadRequestError("Discount code has expired");
    }

    if (new Date(end_date).getTime() < new Date(start_date).getTime()) {
      throw new BadRequestError("Start date must be before end_date");
    }

    //create discount
    const foundDiscount = await checkExistDiscount({
      model: DiscountModel,
      filter: {
        discount_code: code,
        discount_shopID: convertToObjectIDMongodb(shopID),
      },
    });

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount exists");
    }

    const newDiscount = await DiscountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: maxUses,
      discount_uses_count: usesCount,
      discount_users_used: usersUsed,
      discount_max_uses_per_user: maxUsesPerUser,
      discount_min_order_value: minOrderValue || 0,
      discount_max_value: maxValue,
      discount_shopID: shopID,
      discount_is_active: isActive,
      discount_applies_to: appliesTo,
      discount_product_ids: appliesTo === "all" ? [] : productIds,
    });

    return newDiscount;
  }

  // update
  static async updateDiscount() {
    //
  }

  // get all discount codes by user
  static async getAllDiscountCodesWithProduct({ code, shopID, limit, page }) {
    const foundDiscount = await checkExistDiscount({
      model: DiscountModel,
      filter: {
        discount_code: code,
        discount_shopID: convertToObjectIDMongodb(shopID),
      },
    });

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new NotFoundError("Discount not exist");
    }

    const { discount_applies_to, discount_product_ids } = foundDiscount;
    let products;
    if (discount_applies_to === "all") {
      // get all
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIDMongodb(shopID),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    if (discount_applies_to === "specific") {
      // get product ids

      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    }
    return products;
  }

  // get all discount code of shop
  static async getAllDiscountCodesByShop({ limit, page, shopID }) {
    const discounts = await findAllDiscountCodesUnselect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopID: shopID,
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopID"],
      model: DiscountModel,
    });
    return discounts;
  }

  // apply discount code
  static async getDiscountAmount({ codeID, userID, shopID, products }) {
    const foundDiscount = await checkExistDiscount({
      model: DiscountModel,
      filter: {
        discount_code: codeID,
        discount_shopID: convertToObjectIDMongodb(shopID),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exist");
    }

    const {
      discount_is_active,
      discount_max_uses,
      discount_start_date,
      discount_end_date,
      discount_min_order_value,
      discount_max_uses_per_user,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundDiscount;
    if (!discount_is_active) throw new NotFoundError("Discount expired");
    if (!discount_max_uses) throw new NotFoundError("Discount are out");

    if (Date.now() > new Date(discount_end_date).getTime()) {
      throw new BadRequestError("Discount code has expired");
    }
    if (
      new Date(discount_end_date).getTime() <
      new Date(discount_start_date).getTime()
    ) {
      throw new BadRequestError("Start date must be before end_date");
    }
    // check xem code co thoa man gia tri toi thieu cua don hang hay khong
    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      //get total
      totalOrder = products.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      if (totalOrder < discount_min_order_value) {
        throw new NotFoundError(
          `Discount code required a minium order value of${discount_min_order_value}`
        );
      }
    }

    if (discount_max_uses_per_user > 0) {
      const usedUsersDiscount = discount_users_used.find(
        (user) => user.userID === userID
      );
      if (usedUsersDiscount) throw NotFoundError(`Discount code used`);
    }

    // check xem discount nay la fixed_amount
    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  // delete
  static async deleteDiscountCode({ shopID, codeID }) {
    const deleted = await DiscountModel.findOneAndDelete({
      discount_code: codeID,
      discount_shopID: convertToObjectIDMongodb(shopID),
    });
    return deleted;
  }

  // cancel
  static async cancelDiscountCode({ codeID, shopID, userID }) {
    const foundDiscount = await checkExistDiscount({
      model: DiscountModel,
      filter: {
        discount_code: codeID,
        discount_shopID: convertToObjectIDMongodb(shopID),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not exist");
    }

    const result = await DiscountModel.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userID,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
