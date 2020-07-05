// graphql.js

const { gql } = require("apollo-server-lambda");
const {
  PubSub,
  Server,
  RedisConnectionManager,
  RedisSubscriptionManager,
} = require("aws-lambda-graphql");
var AWS = require("aws-sdk");

const Redis = require("ioredis");

const redisClient = new Redis({
  port: 6379, // Redis port
  host: "127.0.0.1", // Redis host
});

let dummyNumber = 0;

const subscriptionManager = new RedisSubscriptionManager({
  redisClient,
});
const connectionManager = new RedisConnectionManager({
  subscriptionManager,
  redisClient,
});

const pubsub = new PubSub({
  eventStore: {
    publish(event, payload) {
      console.log(event, payload);
    },
  },
});

setInterval(() => {
  pubsub.publish(`user_123`, {
    progresses: [
      {
        task_id: "123",
        date_key: "20200102",
        count: dummyNumber,
      },
    ],
  });
  console.log("published event: ", dummyNumber);
  dummyNumber++;
}, 1000);

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Progress {
    count: Int!
    task_id: String!
    date_key: String!
  }

  type Query {
    hello: String
  }
  type Subscription {
    progresses: [Progress]
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Subscription: {
    progresses: {
      subscribe: () => pubsub.subscribe("user_123"),
      resolve: (value) => value,
    },
  },
};

const server = new Server({
  typeDefs,
  resolvers,
  connectionManager,
  subscriptionManager,
});

exports.handleWebSocket = server.createWebSocketHandler();
exports.handleHTTP = server.createHttpHandler();
