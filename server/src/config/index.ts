
import {config as dotenvConfig} from 'dotenv';

if (process.env.NODE_ENV === "test") {
  dotenvConfig({path: 'test.env'})
} else if (process.env.NODE_ENV != 'production') {
  dotenvConfig({path: 'development.env'})
  if (process.env.IS_DOCKERIZED !== undefined) {
    console.log("DOCKERIZED")
    process.env.PG_HOST = 'host.docker.internal'
  }

  if (process.env.DOCKER !== undefined) {
    process.env.IS_DOCKERIZED = 'redis'
  }
}

export default {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    progressUpdatedQueueName: process.env.REDIS_PROGRESS_QUEUE_NAME,
    createStreamQueueName: process.env.REDIS_CREATE_STREAM_QUEUE_NAME,
  },
  salesforce: {
    clientID: process.env.SALESFORCE_CONSUMER_KEY,
    clientSecret: process.env.SALESFORCE_CONSUMER_SECRET,
    streamHealthCheckIntervalInSeconds: parseInt(process.env.SALESFORCE_HEALTH_CHECK_INTERVAL_IN_SECONDS || '600', 10),
    callbackURI: process.env.SALESFORCE_CALLBACK_URI,
  },
  postgres: {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
  },
  server: {
    baseURL: process.env.BASE_URL,
    appSecret: process.env.APP_SECRET,
  }
}