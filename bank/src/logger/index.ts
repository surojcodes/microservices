import pino from "pino";

const logger = pino({
  base: {
    service: "bank-service",
    env: process.env.NODE_ENV || "development",
  },
  level: process.env.LOG_LEVEL || "info",
});
export default logger;
