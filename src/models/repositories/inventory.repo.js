const { InventoryModel } = require("../inventory.model");

const insertInventory = async ({
  productID,
  shopID,
  stock,
  location = "unKnow",
}) => {
  return await InventoryModel.create({
    inventory_productID: productID,
    inventory_location: location,
    inventory_stock: stock,
    inventory_shopID: shopID,
  });
};

module.exports = { insertInventory };
