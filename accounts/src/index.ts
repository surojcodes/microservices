import express from "express";
import { configDotenv } from "dotenv";
import accountRouter from "./routes";
import healthRouter from "./routes/health";
import logger from "./logger";
import PinoHttp from "pino-http";
import { httpRequestDuration, httpRequestTotal, register } from "./metrics";
import { metricsMiddleware } from "./middleware/metrics";

configDotenv();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(PinoHttp({ logger }));
app.use(metricsMiddleware);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.use("/accounts", accountRouter);
app.use("/", healthRouter);

app.listen(PORT, () => {
  logger.info(`Account service is running on port ${PORT}`);
});
