const amqplib = require("amqplib");

const message = "hello chung, welcome RabbitMQ";

const runProducer = async () => {
  try {
    const conn = await amqplib.connect("amqp://localhost");

    const channel = await conn.createChannel();

    const queueName = "test-topic";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send message to Consumer

    channel.sendToQueue(queueName, Buffer.from(message));

    console.log(`message: ${message}`);
  } catch (error) {
    console.log(error);
  }
};

runProducer().catch(console.error);
