import express from "express";
import { configDotenv } from "dotenv";
import accountRouter from "./routes";
import healthRouter from "./routes/health";
import logger from "./logger";
import PinoHttp from "pino-http";

configDotenv();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(PinoHttp({ logger }));
app.use("/accounts", accountRouter);
app.use("/", healthRouter);

app.listen(PORT, () => {
  logger.info(`Account service is running on port ${PORT}`);
});
