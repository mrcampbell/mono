import resolvers from "../src/graphql/resolvers";
import typeDefs from "../src/graphql/typedef";
import { createTestClient } from "apollo-server-testing";
import { gql, ApolloServer } from "apollo-server";
import { createConnection, getRepository, getConnection } from "typeorm";
import { typeORMConfig } from "../src/config/typeorm";
import SynchronousEventBus, { handler } from "../src/queues/sync";
import { StreamEvent } from "../src/entities/StreamEvent";
import { StreamEventFields } from "../src/entities/StreamEventFields";

const server = new ApolloServer({
  context: ({ req }) => {
    return {
      isAuthorized: true,
      user: {
        id: "salesforce|0056g000002hQheAAE",
        organization_id: "00D6g000003rYYlEAM",
        salesforce_user_id: "0056g000002hQheAAE",
        salesforce_username: "michaelrcampbell0916-sync@gmail.com",
        salesforce_profile_picture:
          "https://c.na174.content.force.com/profilephoto/005/F",
        salesforce_thumbnail_picture:
          "https://c.na174.content.force.com/profilephoto/005/T",
        name: "Mike Campbell",
        first_logged_in_at: "2020-06-20T04:11:27.604Z",
        last_logged_in_at: "2020-06-30T17:28:23.275Z",
        salesforce_meta: {
          id: "salesforce|00D6g000003rYYlEAM",
          organization_id: "00D6g000003rYYlEAM",
          access_token: "access token",
          refresh_token: "refresh token",
          instance_url: "https://na174.salesforce.com",
          issued_at: 1593538103,
          initialized_at: null,
          last_transmission: null,
          last_health_check: null,
          stream_is_live: false,
        },
      },
    };
  },
  resolvers,
  typeDefs,
});

const { query, mutate } = createTestClient(server as any);

beforeAll(() => createConnection(typeORMConfig));

it("returns progresses", (done) => {
  return query({
    query: gql`
      query {
        progresses {
          count
          task_id
          date_key
        }
      }
    `,
  })
    .then((response) => {
      expect(response.errors).toBeUndefined();
      done();
    })
    .catch((err) => {
      done(err);
    });
});

it("creates first task condition", (done) => {
  return mutate({
    mutation: gql`
      mutation createTC {
        create_task_condition(
          input: {
            name: "task condition with pre, target, and disqualifying values"
            object_type: "Account"
            field_name: "Stage"
            pre_target_values: ["A", "B", "C"]
            target_values: ["L", "M", "N"]
            disqualifying_values: ["X", "Y", "Z"]
          }
        ) {
          id
          organization_id
          object_type
          field_name
          pre_target_values
          target_values
          disqualifying_values
        }
      }
    `,
  })
    .then((data) => {
      done();
    })
    .catch(done);
});

it("creates second task condition", (done) => {
  return mutate({
    mutation: gql`
      mutation createTC {
        create_task_condition(
          input: {
            name: "task condition with target and disqualifying values"
            object_type: "Account"
            field_name: "Stage"
            pre_target_values: []
            target_values: ["L", "M"]
            disqualifying_values: ["X", "Y", "Z"]
          }
        ) {
          id
          organization_id
          object_type
          field_name
          pre_target_values
          target_values
          disqualifying_values
        }
      }
    `,
  })
    .then((data) => {
      done();
    })
    .catch(done);
});

it("creates third task condition", (done) => {
  return mutate({
    mutation: gql`
      mutation createTC {
        create_task_condition(
          input: {
            name: "task condition with only target values"
            object_type: "Account"
            field_name: "Stage"
            pre_target_values: []
            target_values: ["L", "M", "N"]
            disqualifying_values: []
          }
        ) {
          id
          organization_id
          object_type
          field_name
          pre_target_values
          target_values
          disqualifying_values
        }
      }
    `,
  })
    .then((data) => {
      done();
    })
    .catch(done);
});

it("create event via sync event bus", async (done) => {
  const StageA = new StreamEventFields()
  StageA.field = "Stage";
  StageA.value = "A";
  

  const StageN = new StreamEventFields() 
  StageN.field = "Stage";
  StageN.value =  "N";
  

  const first: StreamEvent =  {
    object_id: "123",
    last_modified_by_id: "0056g000002hQheAAE",
    change_type: "CREATE",
    fields: [StageA],
    object_type: "Account",
    last_modified_date_key: "20190101",
    organization_id: "00D6g000003rYYlEAM",
    commit_timestamp: new Date(1592233856000)
  }

  const second: StreamEvent =  {
    object_id: "123",
    last_modified_by_id: "0056g000002hQheAAE",
    change_type: "UPDATE",
    fields: [StageN],
    object_type: "Account",
    last_modified_date_key: "20190101",
    organization_id: "00D6g000003rYYlEAM",
    commit_timestamp: new Date(1592665856000)
  }

  await getRepository(StreamEvent).save([first, second])

  const fields = new Map<string, any>();
  fields.set("Stage", "Z");
  handler({
    change_type: "UPDATE",
    commit_user: "0056g000002hQheAAE",
    organization_id: "00D6g000003rYYlEAM",
    entity_name: "Account",
    fields,
    record_ids: ["123"],
    raw: "",
    replay_id: 1,
    commit_timestamp: 1593616257000
  })
    .then((res) => {
      done();
    })
    .catch((err) => {
      done(err);
    });
});
