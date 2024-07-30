const amqplib = require("amqplib");

const message = "hello chung, welcome RabbitMQ";

const runConsumer = async () => {
  try {
    const conn = await amqplib.connect("amqp://localhost");

    const channel = await conn.createChannel();

    const queueName = "test-topic";

    await channel.assertQueue(queueName, {
      durable: true,
    });

    // send message to Consumer

    channel.consume(
      queueName,
      (message) => {
        console.log(`received message: ${message.content.toString()}`);
      },
      {
        noAck: true,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

runConsumer().catch(console.error);
