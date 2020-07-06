// const { createLogger, format, transports }, winston = require('winston');
import winston from 'winston';
import * as Sentry from '@sentry/node';
Sentry.init({ dsn: 'https://28d5bf0a5d6148bd8e3e72f3133912dd@o416781.ingest.sentry.io/5313233' })

console.log('started sentry')
// const { combine, timestamp, label, printf, prettyPrint, ms, json} = winston.format;

// const myFormat = printf(({ level, message, timestamp, ms }) => {
//   // todo: this is so bad...
//   return `${new Date(timestamp).toLocaleTimeString()} (${ms}) [${level}]: ${message}`;
// });

// const logger = winston.createLogger({
//     format: combine(
//       winston.format.colorize(),
//       timestamp(),
//       ms(),
//       myFormat
//     ),
//   transports: [
//     new winston.transports.Console(),
//     new ElasticsearchTransport({
//       client,
//     }),
//   ]
// })

// logger.on('error', (error) => { // Compulsory error handling
//   console.error('Error caught', error);
// });

// export default logger;