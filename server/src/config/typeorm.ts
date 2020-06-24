import { ConnectionOptions } from 'typeorm';
import config from '.';
import { SalesforceMeta } from '../entities/SalesforceMeta';
import { TaskCondition } from '../entities/TaskCondition';
import { User } from '../entities/User';


let shouldSynchronize = false;
// if (
//   process.env.NODE_ENV === "test" ||
//   process.env.NODE_ENV === "dev" && process.env.SERVICE === "core"
//   ) {
//   shouldSynchronize = true;
// }


export let typeORMConfig: ConnectionOptions = {
  type: "postgres",
  name: "default",
  entities: [
    SalesforceMeta,
    TaskCondition,
    User,
  ],
  logging: true,
  host: config.postgres.host,
  port: parseInt(config.postgres.port || '5432', 10),
  username: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  synchronize: shouldSynchronize,
  dropSchema: false,
}


