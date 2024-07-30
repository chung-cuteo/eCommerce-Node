"use strict";

const { connectToRabbitMQForTest } = require("../dbs/init.rabbit");

describe("Rabbit MQ connection", () => {
  it("should connect to successful Rabbit MQ", async () => {
    const result = await connectToRabbitMQForTest();
    expect(result).toBeUndefined();
  });
});
