// const { createLogger, format, transports }, winston = require('winston');
import winston from 'winston';
import {ElasticsearchTransport } from 'winston-elasticsearch';
const { Client } = require('@elastic/elasticsearch')
const client = new Client({ node: 'http://165.227.24.218/:9200', name: 'local-server' })

const { combine, timestamp, label, printf, prettyPrint, ms, json} = winston.format;

const myFormat = printf(({ level, message, timestamp, ms }) => {
  // todo: this is so bad...
  return `${new Date(timestamp).toLocaleTimeString()} (${ms}) [${level}]: ${message}`;
});

const logger = winston.createLogger({
    format: combine(
      winston.format.colorize(),
      timestamp(),
      ms(),
      myFormat
    ),
  transports: [
    new winston.transports.Console(),
    new ElasticsearchTransport({
      client,
    }),
  ]
})

logger.on('error', (error) => { // Compulsory error handling
  console.error('Error caught', error);
});

export default logger;