const redisPubSubService = require("../src/services/redisPubsub.service");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (channel, message) => {
      console.log("nhan message", message);
      InventoryServiceTest.updateInventory(message);
    });
  }

  static updateInventory({ productId, quantity }) {
    console.log(`Updated inventory ${productId} with quantity ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();
