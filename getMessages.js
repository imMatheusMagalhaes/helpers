const { Kafka } = require("kafkajs");
const fs = require("fs");
const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
let topic;
let offset;
let partition;
let id = "dev";
let select

const getData = () =>
  new Promise((resolve, _) =>
    readline.question("what topic?\n", (value) => {
      topic = value;
      readline.question("consume [0] or produce [1]?\n", (value) => {
        select = Number(value)
        if (select === 1 || select !== 0) {
          readline.close();
          return resolve();
        }
        readline.question("from which offset?\n", (value) => {
          offset = value;
          readline.question("what partition?\n", (value) => {
            partition = value;
            readline.close();
            return resolve();
          });
        });
      });
    })
  );
const kafka = () =>
  new Kafka({
    clientId: id,
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
const runConsume = async () => {
  const consumer = kafka().consumer({ groupId: id });
  await consumer.connect();
  await consumer.subscribe({ topics: [topic] });
  consumer.run({
    autoCommit: true,
    eachMessage: task
  });
  consumer.seek({ topic, partition, offset });
};

const task = async ({ message }) => {
  const format = {
    key: message.key.toString(),
    offset: message.offset.toString(),
    value: JSON.parse(message.value.toString()),
  };
  const data = JSON.stringify(format, null, 2);
  const now = new Date()
  fs.appendFile(`events_${now.getDate().toString()}-${now.getMonth().toString()}.json`, data, (err) => {
    if (err) throw err;
    console.log(`offset: ${message.offset.toString()} - written to file`);
  });
}

const runProducer = async () => {
  const events = require("./events.json")
  const producer = kafka().producer({
    allowAutoTopicCreation: false,
    transactionTimeout: 30000,
  });
  await producer.connect()
  await producer.send({
    topic,
    messages: events.map(m => {
      console.log(`message ${m.key} produced`);
      return {
        key: m.key,
        value: JSON.stringify(m.value),
      }
    }),
  })
};

getData().then(async () => {
  if (select === 0) return await runConsume();
  else if (select === 1) return await runProducer();
  else return console.log(`${select} not valid!!!`)
});
