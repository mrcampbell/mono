// graphql.js

const { ApolloServer, gql } = require('apollo-server-lambda');
const { PubSub } = require("apollo-server");

let dummyNumber = 0;

const pubsub = new PubSub();

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
    hello: () => 'Hello world!',
  },
  Subscription: {
    progresses: {
      subscribe: () => pubsub.asyncIterator(['user_123']),
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.handler = server.createHandler();