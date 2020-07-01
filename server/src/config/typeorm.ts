import { ConnectionOptions } from 'typeorm';
import config from '.';
import { SalesforceMeta } from '../entities/SalesforceMeta';
import { TaskCondition } from '../entities/TaskCondition';
import { User } from '../entities/User';
import { TaskEvent } from '../entities/TaskEvent';
import { StreamEvent } from '../entities/StreamEvent';
import { StreamEventFields } from '../entities/StreamEventFields';


let shouldSynchronize = false;
if (
  process.env.NODE_ENV === "test" ||
  process.env.NODE_ENV === "dev" && process.env.SERVICE === "core"
  ) {
  shouldSynchronize = true;
}


export let typeORMConfig: ConnectionOptions = {
  type: "postgres",
  name: "default",
  entities: [
    SalesforceMeta,
    TaskCondition,
    User,
    TaskEvent,
    StreamEvent,
    StreamEventFields,
  ],
  logging: false,
  host: config.postgres.host,
  port: parseInt(config.postgres.port || '5432', 10),
  username: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: shouldSynchronize,
  dropSchema: (process.env.NODE_ENV == "test") ? true : false,
}