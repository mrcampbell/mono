import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";
import { setContext } from "apollo-link-context";
import fetch from 'node-fetch';
import * as ws from 'ws';
import gql from 'graphql-tag';

// https://www.apollographql.com/docs/react/migrating/boost-migration/

const httpLink = new HttpLink({fetch, uri: 'https://1x6efa94w4.execute-api.us-east-1.amazonaws.com/dev/hello' });

// const middlewareLink = new ApolloLink((operation, forward) => {
//   // get the authentication token from local storage if it exists
//   const tokenValue = Cookies.get(AUTH_TOKEN)
//   // return the headers to the context so httpLink can read them
//   operation.setContext({
//     headers: {
//       Authorization: tokenValue ? `Bearer ${tokenValue}` : '',
//     },
//   })
//   return forward(operation)
// })

// authenticated httplink
// const httpLinkAuth = middlewareLink.concat(httpLink)

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: 'yep',
    },
  };
});

const wsLink = new WebSocketLink({
  uri: 'wss://vuh4nxnurh.execute-api.us-east-1.amazonaws.com/dev',
  options: {
    reconnect: true,
  },
  webSocketImpl: ws,
});

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     console.log(graphQLErrors);
//     graphQLErrors.map(({ message, locations, path }) =>
//       console.log(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//       )
//     );
//   }

//   if (networkError) console.log(`[Network error]: ${networkError}`);
// });

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(
      query as any
    ) as any;
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

// apollo client setup
const client = new ApolloClient({
  link: ApolloLink.from([authLink, link]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

client.subscribe({
  query: gql`subscription {
    progresses {
      count
    }
  }`
}).subscribe(next => {
  console.log(next)

}, console.error)

