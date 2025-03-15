import winston from "winston";
import winstonRotate from "winston-daily-rotate-file";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.Console(),
    new winstonRotate({
      filename: "logs/app-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "2d",
    }),
  ],
});

export default logger;
