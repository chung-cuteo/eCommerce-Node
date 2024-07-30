const Redis = require("redis");

class RedisPubSubService {
  constructor() {
    this.subscriber = Redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_POST,
    });
    this.publisher = Redis.createClient({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_POST,
    });
  }

  publish(channel, message) {
    return new Promise((res, rej) => {
      this.publisher.publish(channel, message, (err, reply) => {
        if (err) {
          rej(err);
        } else {
          res(reply);
        }
      });
    });
  }

  subscribe(channel, cb) {
    this.subscriber.subscribe(channel);
    this.subscriber.on("message", (subscriberChannel, message) => {
      if (channel === subscriberChannel) {
        cb(channel, message);
      }
    });
  }
}

module.exports = new RedisPubSubService();
