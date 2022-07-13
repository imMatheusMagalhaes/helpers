const { Kafka } = require("kafkajs");
const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
let topic;
let offset;
let partition;
const getData = () =>
  new Promise((resolve, _) =>
    readline.question("what topic?\n", (value) => {
      topic = value;
      readline.question("from which offset?\n", (value) => {
        offset = value;
        readline.question("what partition?\n", (value) => {
          partition = value;
          readline.close();
          resolve();
        });
      });
    })
  );
const runKafka = async () => {
  const kafka = new Kafka({
    clientId: "dev",
    brokers: ["pkc-lgk0v.us-west1.gcp.confluent.cloud:9092"],
    ssl: true,
    connectionTimeout: 45000,
    sasl: {
      mechanism: "plain",
      username: "W7CPMTHUQQBBWFBC",
      password:
        "yVEW4Y+q0j/HsbFLTfCaOlYE/8P2YXcubdt5qWln2PYCAyCgDUzPbMUgsatfL/8e",
    },
  });
  const consumer = kafka.consumer({ groupId: "dev" });
  await consumer.connect();
  await consumer.subscribe({ topics: [topic] });
  return consumer;
};
const run = async () => {
  const consumer = await runKafka();
  consumer.run({
    autoCommit: true,
    eachMessage: async ({ message }) => {
      const format = {
        key: message.key.toString(),
        offset: message.offset.toString(),
        value: JSON.parse(message.value.toString()),
      };
      const data = JSON.stringify(format, null, 2);
      fs.appendFile("events.json", data, (err) => {
        if (err) throw err;
        console.log(`offset: ${message.offset.toString()} - written to file`);
      });
    },
  });
  consumer.seek({ topic, partition, offset });
};
getData().then(() => run());