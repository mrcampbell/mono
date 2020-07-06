import { gql } from "apollo-server";

// The GraphQL schema
export default gql`
  type Progress {
    count: Int!
    task_id: String!
    date_key: String!
  }

  type TaskConditionStage {
    values: [String]!
    type: String!
  }

  type TaskCondition {
    id: ID!
    name: String!
    organization_id: String!
    object_type: String!
    field_name: String!
    stages: [TaskConditionStage]!
  }

  input InputTaskConditionStage {
    values: [String]!
    type: String!
  }

  input CreateTaskCondition {
    name: String!
    object_type: String!
    field_name: String!
    stages: [InputTaskConditionStage]!
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