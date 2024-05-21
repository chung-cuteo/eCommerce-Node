"use strict";

const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const redis = require("redis");
const { promisify } = require("util");
const redisClient = redis.createClient();

// Xử lý các sự kiện của Redis client
client.on("connect", () => {
  console.log("Connected to Redis");
});

client.on("error", (err) => {
  console.log("Redis error: ", err);
});

const pexpire = promisify(redisClient.pexpire).bind(redisClient);
const setnxAsync = promisify(redisClient.setEx).bind(redisClient);

const acquireLock = async (productID, quantity, cartID) => {
  const key = `lock_v2023_${productID}`;
  const retryTimes = 10;
  const expireTime = 3000;

  for (let i = 0; i < retryTimes; i++) {
    // tao 1 key thang nao nam giu dk vao thanh toan
    const result = await setnxAsync(key, expireTime);
    console.log("result", result);
    if (result === 1) {
      // thao tac voi inventory
      const isReservation = await reservationInventory({
        productID,
        quantity,
        cartID,
      });
      if (isReservation.modifiedCount) {
        await pexpire(key, expireTime);
        return key;
      }
      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

const releaseLock = async (keyLock) => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient);
  return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
