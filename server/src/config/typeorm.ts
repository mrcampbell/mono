import { ConnectionOptions } from 'typeorm';
import config from '.';
import { SalesforceMeta } from '../entities/SalesforceMeta';
import { TaskCondition } from '../entities/TaskCondition';
import { User } from '../entities/User';
import { TaskEvent } from '../entities/TaskEvent';
import { StreamEvent } from '../entities/StreamEvent';
import { StreamEventFields } from '../entities/StreamEventFields';
import { TaskConditionStage } from '../entities/TaskConditionStages';


let shouldSynchronize = false;
if (
  process.env.NODE_ENV === "test" ||
  process.env.NODE_ENV === "dev" && process.env.SERVICE === "core"
  ) {
  shouldSynchronize = true;
}


let typeORMConfig: ConnectionOptions = {
  type: "postgres",
  name: "default",
  entities: [
    SalesforceMeta,
    TaskCondition,
    TaskConditionStage,
    User,
    TaskEvent,
    StreamEvent,
    StreamEventFields,
  ],
  logging: false,
  host: (config.server.isLocal) ? config.postgres.host : undefined,
  port:(config.server.isLocal) ?  parseInt(config.postgres.port || '5432', 10) : undefined,
  username:(config.server.isLocal) ?  config.postgres.user : undefined,
  password:(config.server.isLocal) ?  config.postgres.password : undefined,
  database:(config.server.isLocal) ?  config.postgres.database : undefined,
  synchronize: shouldSynchronize,
  dropSchema: (process.env.NODE_ENV == "test") ? true : false,
  url: (!config.server.isLocal) ? process.env.DATABASE_URL : undefined
}


export { typeORMConfig };