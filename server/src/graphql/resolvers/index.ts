import { ApolloServer, PubSub, gql } from "apollo-server";
import login_with_salesforce from "./mutations/login_with_salesforce";
import create_task_condition from "./mutations/create_task_condition";
import progresses from "./query/progresses";
import proxy_salesforce_describe_object from "./query/proxy_salesforce_describe_object";
import proxy_salesforce_list_all_objects from "./query/proxy_salesforce_list_all_objects";
import all_task_conditions from "./query/all_task_conditions";
import { pubsub } from "../..";
import config from "../../config";

export default {
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
      subscribe: () => pubsub.asyncIterator(['user_123']),
    },
  },
};