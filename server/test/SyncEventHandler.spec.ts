import resolvers from "../src/graphql/resolvers";
import typeDefs from "../src/graphql/typedef";
import { createTestClient } from "apollo-server-testing";
import { gql, ApolloServer } from "apollo-server";
import { createConnection, getRepository, getConnection } from "typeorm";
import { typeORMConfig } from "../src/config/typeorm";
import SynchronousEventBus, { handler } from "../src/queues/sync";
import { StreamEvent } from "../src/entities/StreamEvent";
import { StreamEventFields } from "../src/entities/StreamEventFields";
import { TaskCondition } from "../src/entities/TaskCondition";

beforeAll(async () => {
  await createConnection(typeORMConfig)
  await getRepository(TaskCondition).save({
    name: "task condition with disq, pre, and target",
    field_name: "Stage",
    object_type: "Opportunity",
    organization_id: "123",
    pre_target_values: ["A", "B", "C"],
    target_values: ["L", "M", "N"],
    disqualifying_values: ["X", "Y", "Z"],
  })
  await getRepository(TaskCondition).save({
    name: "task condition with pre and target",
    field_name: "Stage",
    object_type: "Opportunity",
    organization_id: "123",
    pre_target_values: ["A", "B", "C"],
    target_values: ["L", "M", "N"],
    disqualifying_values: [],
  })
  await getRepository(TaskCondition).save({
    name: "task condition with target and disq",
    field_name: "Stage",
    object_type: "Opportunity",
    organization_id: "123",
    pre_target_values: [],
    target_values: ["L", "M", "N"],
    disqualifying_values: ["X", "Y", "Z"],
  })
  await getRepository(TaskCondition).save({
    name: "task condition with only target",
    field_name: "Stage",
    object_type: "Opportunity",
    organization_id: "123",
    pre_target_values: [],
    target_values: ["L", "M", "N"],
    disqualifying_values: [],
  })
});


it("run through the sync bus entirely off of handler", async (done) => {

  const entity_name = "Opportunity";
  const object_id = "567";
  const commit_user = "234";
  const organization_id = "123";

  // use the previous values
  await handler({
    change_type: "CREATE",
    commit_user,
    organization_id,
    entity_name,
    fields:  new Map<string, any>([["Stage", "A"]]),
    record_ids: [object_id],
    raw: "",
    replay_id: 1,
    commit_timestamp: 1593616257000
  })

  await handler({
    change_type: "UPDATE",
    commit_user,
    organization_id,
    entity_name,
    fields:  new Map<string, any>([["Stage", "B"]]),
    record_ids: [object_id],
    raw: "",
    replay_id: 2,
    commit_timestamp: 1593616258000
  })

  await handler({
    change_type: "UPDATE",
    commit_user,
    organization_id,
    entity_name,
    fields:  new Map<string, any>([["Stage", "M"]]),
    record_ids: [object_id],
    raw: "",
    replay_id: 3,
    commit_timestamp: 1593616259000
  })

  await handler({
    change_type: "UPDATE",
    commit_user,
    organization_id,
    entity_name,
    fields:  new Map<string, any>([["Stage", "N"]]),
    record_ids: [object_id],
    raw: "",
    replay_id: 4,
    commit_timestamp: 1593616260000
  })

  await handler({
    change_type: "UPDATE",
    commit_user,
    organization_id,
    entity_name,
    fields:  new Map<string, any>([["Stage", "Z"]]),
    record_ids: [object_id],
    raw: "",
    replay_id: 5,
    commit_timestamp: 1593616261000
  })
    
  done();
});

