import { ApolloServer, PubSub, gql } from "apollo-server";
import config from "./config";
import { createConnection } from "typeorm";
import { typeORMConfig } from "./config/typeorm";
import login_with_salesforce from "./graphql/resolvers/mutations/login_with_salesforce";
import create_task_condition from "./graphql/resolvers/mutations/create_task_condition";
import progresses from "./graphql/resolvers/query/progresses";
import context from "./graphql/context/context";
import proxy_salesforce_describe_object from "./graphql/resolvers/query/proxy_salesforce_describe_object";
import proxy_salesforce_list_all_objects from "./graphql/resolvers/query/proxy_salesforce_list_all_objects";
import all_task_conditions from "./graphql/resolvers/query/all_task_conditions";
import { progressUpdateQueue } from "./queues";
import SynchronousEventBus from "./queues/sync";

const USER_123 = "user_123";

// The GraphQL schema
const typeDefs = gql`
  type Progress {
    count: Int!
    task_id: String!
    date_key: String!
  }

  type TaskCondition {
    id: ID!
    name: String!
    organization_id: String!
    object_type: String!
    field_name: String!
    pre_target_values: [String]!
    target_values: [String]!
    disqualifying_values: [String]!
  }

  input CreateTaskCondition {
    name: String!
    object_type: String!
    field_name: String!
    pre_target_values: [String]!
    target_values: [String]!
    disqualifying_values: [String]!
  }

  type AuthenticationResponse {
    user_email: String
    access_token: String
    error_message: String
  }

  type SalesforceSObjectName {
    name: String!
    label: String!
  }

  type SalesforceSObjectPicklistEntry {
    value: String!
    label: String!
  }

  type SalesforceSObjectField {
    name: String!
    label: String!
    picklist_values: [SalesforceSObjectPicklistEntry]
  }

  type Query {
    "A simple type for getting started!"
    hello: String

    ## Meta / Config
    salesforce_auth_callback_uri: String

    """
    'progresses' returns back a list of all the progresses at the moment of fetching.
    to receive delta updates, subscribe to Subscription.progresses, which will send the progresses that are changed as they're changed
    """
    progresses: [Progress]

    proxy_salesforce_list_all_objects: [SalesforceSObjectName]
    proxy_salesforce_describe_object(name: String!): [SalesforceSObjectField]

    all_task_conditions: [TaskCondition]
  }

  type Mutation {
    login_with_salesforce(code: String!): AuthenticationResponse
    create_task_condition(input: CreateTaskCondition): TaskCondition
  }

  type Subscription {
    progresses: [Progress]
  }
`;

const pubsub = new PubSub();


const resolvers = {
  Query: {
    hello: () => "world",
    salesforce_auth_callback_uri: () =>
      `https://login.salesforce.com/services/oauth2/authorize?client_id=${config.salesforce.clientID}&redirect_uri=${config.salesforce.callbackURI}&response_type=code`,
    progresses: progresses,
    proxy_salesforce_describe_object,
    proxy_salesforce_list_all_objects,
    all_task_conditions,
  },
  Mutation: {
    login_with_salesforce,
    create_task_condition,
  },
  Subscription: {
    progresses: {
      // this sends the deltas as they are received
      subscribe: () => pubsub.asyncIterator([USER_123]),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  subscriptions: {
    // onConnect: (connectionParams: any, websocket: any, context: any): any => {},
    // onDisconnect: (websocket: any, context: any) => {},
  },
  tracing: true,
});

createConnection(typeORMConfig).then(() => {

SynchronousEventBus.setup(pubsub);


  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
