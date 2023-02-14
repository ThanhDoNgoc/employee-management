import winston from "winston";

const options: winston.LoggerOptions = {
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "debug.log", level: "debug" }),
  ],
  exitOnError: false,
};

const logger = winston.createLogger(options);

export default logger;
