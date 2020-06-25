import config from "../config";

const Queue = require('bull');

export const progressUpdateQueue = new Queue(config.redis.progressUpdatedQueueName, {
  redis: {
    port: config.redis.port,
    host: config.redis.host,
    password: config.redis.password
  }
});
