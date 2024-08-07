"use strict";

const {
  reservationInventory,
} = require("../models/repositories/inventory.repo");
const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_POST,
});

// const pexpire = promisify(client.pexpire).bind(client);
// const setnxAsync = promisify(client.setEx).bind(client);

const acquireLock = async (productID, quantity, cartID) => {
  // const key = `lock_v2023_${productID}`;
  // const retryTimes = 10;
  // const expireTime = 3000;
  // for (let i = 0; i < retryTimes; i++) {
  //   // tao 1 key thang nao nam giu dk vao thanh toan
  //   const result = await setnxAsync(key, expireTime);
  //   console.log("result", result);
  //   if (result === 1) {
  //     // thao tac voi inventory
  //     const isReservation = await reservationInventory({
  //       productID,
  //       quantity,
  //       cartID,
  //     });
  //     if (isReservation.modifiedCount) {
  //       await pexpire(key, expireTime);
  //       return key;
  //     }
  //     return null;
  //   }
  //   await new Promise((resolve) => setTimeout(resolve, 50));
  // }
};

const releaseLock = async (keyLock) => {
  // const delAsyncKey = promisify(client.del).bind(client);
  // return await delAsyncKey(keyLock);
};

module.exports = {
  acquireLock,
  releaseLock,
};
