"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    mongoose
      .connect(process.env.MONGO_URI, {
        maxPoolSize: 50,
      })
      .then(() => {
        console.log("Connected to MongoDB success");
        countConnect();
      })
      .catch((error) => {
        console.error("Connection to MongoDB failed:", error);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
