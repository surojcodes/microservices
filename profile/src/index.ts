import express from "express";
import { configDotenv } from "dotenv";
import profileRouter from "./router";
import healthRouter from "./router/health";
import logger from "./logger";
import PinoHttp from "pino-http";

const app = express();

configDotenv();
const PORT = process.env.PORT;

app.use(express.json());
app.use(PinoHttp({ logger }));
app.use("/profiles", profileRouter);
app.use("/", healthRouter);

app.listen(PORT, () => {
  logger.info(`Profile service is running on port ${PORT}`);
});
