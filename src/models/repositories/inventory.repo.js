const { convertToObjectIDMongodb } = require("../../utils");
const { InventoryModel } = require("../inventory.model");

const insertInventory = async ({
  // add hang ton kho la bao nhieu
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

const reservationInventory = async ({ productID, quantity, cartID }) => {
  // mua hang
  const query = {
    inventory_productID: convertToObjectIDMongodb(productID),
    inventory_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      inventory_stock: -quantity,
    },
    $push: {
      inventory_reservations: {
        quantity,
        cartID,
        createOn: new Date(),
      },
    },
  };
  const options = {
    upsert: true,
    new: true,
  };

  return await InventoryModel.updateOne(query, updateSet, options);
};

module.exports = { insertInventory, reservationInventory };
