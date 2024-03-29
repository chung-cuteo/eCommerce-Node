"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {db: {host, port, name}} = require('../configs/config.app')
 
class Database {
  constructor() {
    this.connect();
  }


  connect(type = "mongodb") {
    const connectString = `mongodb://${host}:${port}/${name}`;

    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then(() => {
        console.log("Connected to MongoDB success");
        countConnect();
      })
      .catch((error) => {
        console.error("Connection to MongoDB failed:", error);
      });

    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
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
