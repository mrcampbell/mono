import { createConnection } from "typeorm";
import { typeORMConfig } from "./src/config/typeorm";
import SynchronousEventBus from "./src/queues/sync";
import { server, pubsub } from "./src";

import * as Sentry from '@sentry/node';


Sentry.init({ dsn: 'https://28d5bf0a5d6148bd8e3e72f3133912dd@o416781.ingest.sentry.io/5313233' })

// logger.info("Startup")

createConnection(typeORMConfig).then(async () => {

  await SynchronousEventBus.setup(pubsub);

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
});
