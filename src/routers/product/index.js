"use strict";

const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/checkAuth");

router.get(
  "/search/:keySearch",
  asyncHandler(ProductController.findAllSearchProduct)
);
router.get("/getAll", asyncHandler(ProductController.findAllProducts));
router.get("/:product_id", asyncHandler(ProductController.findOneProduct));

// check authentication before below router here , new pass chuyen keyStore xuong cho router duoi
router.use(authentication);
//

router.get("/draft", asyncHandler(ProductController.findAllDraftForShop));
router.get(
  "/published",
  asyncHandler(ProductController.findAllPublishedForShop)
);
router.post("/create", asyncHandler(ProductController.createProduct));
router.patch("/:productID", asyncHandler(ProductController.updateProduct));
router.put(
  "/publish/:id",
  asyncHandler(ProductController.publishProductIDForShop)
);
router.put(
  "/unPublish/:id",
  asyncHandler(ProductController.unPublishProductIDForShop)
);

module.exports = router;
