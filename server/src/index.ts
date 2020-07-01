import { ApolloServer, PubSub } from "apollo-server";
import context from "./graphql/context/context";
import resolvers from './graphql/resolvers';
import typeDefs from './graphql/typedef';


export let pubsub = new PubSub();

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  subscriptions: {
    // onConnect: (connectionParams: any, websocket: any, context: any): any => {},
    // onDisconnect: (websocket: any, context: any) => {},
  },
  tracing: true,
});
