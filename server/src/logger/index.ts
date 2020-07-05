// const { createLogger, format, transports }, winston = require('winston');
import winston from 'winston';

const { combine, timestamp, label, printf, prettyPrint, ms, json} = winston.format;

const myFormat = printf(({ level, message, timestamp, ms }) => {
  // todo: this is so bad...
  return `${new Date(timestamp).toLocaleTimeString()} (${ms}) [${level}]: ${message}`;
});

export default winston.createLogger({
    format: combine(
      winston.format.colorize(),
      timestamp(),
      ms(),
      myFormat
    ),
  transports: [
    new winston.transports.Console(),
  ]
})
