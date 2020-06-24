import gql from "graphql-tag";

export const QUERY_HELLO = gql`
  query {
    hello
  }
`;

export const QUERY_SALESFORCE_AUTH_CALLBACK_URI = gql`
  query {
    salesforce_auth_callback_uri
  }
`;

export const MUTATION_LOGIN_WITH_SALESFORCE = gql`
  mutation login_with_salesforce($code: String!) {
    login_with_salesforce(code: $code) {
      user_email
      access_token
    }
  }
`;

export const QUERY_PROGRESSES = gql`
  query {
    progresses {
      count
      task_id
      date_key
    }
  }
`;

export const SUBSCRIPTION_PROGRESSES = gql`
subscription {
  progresses {
    count
    task_id
    date_key
  }
}
`;

export const QUERY_PROXY_SALESFORCE_DESCRIBE_OBJECT = gql`
  query proxy_salesforce_describe_object($name: String!) {
    proxy_salesforce_describe_object(name: $name) {
      name
      label
      picklist_values {
        value
        label
      }
    }
  }
`;

export const QUERY_PROXY_SALESFORCE_LIST_ALL_OBJECTS = gql`
query {
  proxy_salesforce_list_all_objects {
    name
    label
  }
}
`
