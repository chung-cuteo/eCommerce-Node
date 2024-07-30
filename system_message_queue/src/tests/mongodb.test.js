"use strict";

const mongoose = require("mongoose");
const connectString = "mongodb://localhost:27017/ecommerce-shop";

const TestSchema = new mongoose.Schema({ name: String });
const TestModel = mongoose.model("TestModel", TestSchema);

describe("Mongoose connection", () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("Should connect to mongoose", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it("Should save document to database", async () => {
    const user = new TestModel();
    user.name = "chung";
    await user.save();

    expect(user.isNew).toBe(false);
  });

  it("Should find a document from database", async () => {
    const user = await TestModel.findOne({ name: "chung" });

    expect(user).toBeDefined();
    expect(user.name).toBe("chung");
  });
});
