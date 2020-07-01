import { createConnection } from "typeorm";
import { typeORMConfig } from "./src/config/typeorm";
import SynchronousEventBus from "./src/queues/sync";
import { server, pubsub } from "./src";

createConnection(typeORMConfig).then(async () => {

  await SynchronousEventBus.setup(pubsub);

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
