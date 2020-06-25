import { ApolloServer, PubSub, gql, AuthenticationError } from "apollo-server";
import getAccessTokenFromCookie from "./auth/getAccessTokenFromCookie";
import config from "./config";
import { createConnection, getRepository } from "typeorm";
import { typeORMConfig } from "./config/typeorm";
import login_with_salesforce from "./graphql/resolvers/mutations/login_with_salesforce";
import progresses from "./graphql/resolvers/query/progresses";
import context from "./graphql/context/context";
import proxy_salesforce_describe_object from "./graphql/resolvers/query/proxy_salesforce_describe_object";
import proxy_salesforce_list_all_objects from "./graphql/resolvers/query/proxy_salesforce_list_all_objects";
import { progressUpdateQueue } from "./queues";
import { TaskCondition } from "./entities/TaskCondition";
import { User } from "./entities/User";

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

const subscribedUsers = new Set();

progressUpdateQueue.process(function (job: any, done: any) {
  // console.log(job.data);
  pubsub.publish(job.data.user_id, { progresses: job.data.progresses });
  done();
});

const resolvers = {
  Query: {
    hello: () => "world",
    salesforce_auth_callback_uri: () =>
      `https://login.salesforce.com/services/oauth2/authorize?client_id=${config.salesforce.clientID}&redirect_uri=${config.salesforce.callbackURI}&response_type=code`,
    progresses: progresses,
    proxy_salesforce_describe_object,
    proxy_salesforce_list_all_objects,
  },
  Mutation: {
    login_with_salesforce,
    create_task_condition: async (
      parent: any,
      args: any,
      context: any,
      info: any
    ) => {
      const { name, object_type, field_name, pre_target_values, target_values, disqualifying_values } = args.input;
      const tc: TaskCondition = {
        name,
        object_type,
        field_name, 
        pre_target_values,
        target_values,
        disqualifying_values,
        organization_id: context.user.organization_id,
      }
      try {

        return getRepository(TaskCondition).save(tc).then((data: any) => {
          console.log("GOT" + data)
          return data
        }).catch(err => {
          console.log("Error yo")
          console.log(err)
        })
      } catch (err) {
        console.log(err)
      }
    },
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
    onConnect: (connectionParams: any, websocket: any, context: any): any => {
      console.log("Socket connected");
      try {
        const token = getAccessTokenFromCookie(
          context.request.headers.cookie,
          false
        );
        subscribedUsers.add(token);
        console.log("Added User to Subscription", subscribedUsers);
        return { user: { id: token } }; // todo: auth here
      } catch (err) {
        console.log(err);
        return err;
      }
    },
    onDisconnect: (websocket: any, context: any) => {
      const token = getAccessTokenFromCookie(
        context.request.headers.cookie,
        false
      );
      subscribedUsers.delete(token);
      console.log("Removed User to Subscription", subscribedUsers);
    },
  },
});

createConnection(typeORMConfig).then(() => {
  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
