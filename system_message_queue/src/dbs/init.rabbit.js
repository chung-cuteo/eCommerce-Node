"use strict";

const amqplib = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqplib.connect("amqp://localhost");
    if (!connection) throw new Error("Connect not established");

    const channel = connection.createChannel();

    return { channel, connection };
  } catch (error) {
    console.log(error);
    return null;
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    //publish message
    const queue = "test-queue";

    const message = " hello test rabbit MQ";

    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));

    // close connection
    await connection.close();
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
};
