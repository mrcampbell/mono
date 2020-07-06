import React from "react";
import ReactDOM from "react-dom";
import { split } from "apollo-link";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { onError } from "apollo-link-error";
import { ApolloLink } from "apollo-link";
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from "apollo-link-context";
import * as Sentry from '@sentry/react';

import Store from "./store";

import config from "./config";
import "./index.css";
import App from "./pages/App/App";
import * as serviceWorker from "./serviceWorker";
import { OperationDefinitionNode } from "graphql";
import AuthService from "./auth";

Sentry.init({dsn: "https://ffddf3b7b948446598b902cfaa07f5bd@o416781.ingest.sentry.io/5313252"});


// https://www.apollographql.com/docs/react/migrating/boost-migration/

const httpLink = new HttpLink({ uri: config.server.httpURI });

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
  const token = AuthService.getToken();

  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

const wsLink = new WebSocketLink({
  uri: config.server.wsURI,
  options: {
    reconnect: true,
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log(graphQLErrors);
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(
      query
    ) as OperationDefinitionNode;
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

// apollo client setup
const client = new ApolloClient({
  link: ApolloLink.from([authLink, link, errorLink]),
  cache: new InMemoryCache(),
  connectToDevTools: true,
});

ReactDOM.render(
  <Store>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ApolloProvider>
  </Store>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
