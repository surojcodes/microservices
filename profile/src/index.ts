import express from "express";
import { configDotenv } from "dotenv";
import profileRouter from "./router";
import healthRouter from "./router/health";
import logger from "./logger";
import PinoHttp from "pino-http";
import { metricsMiddleware } from "./middleware/metrics";
import { register } from "./metrics";

const app = express();

configDotenv();
const PORT = process.env.PORT;

app.use(express.json());
app.use(PinoHttp({ logger }));
app.use(metricsMiddleware);
app.use("/profiles", profileRouter);
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.use("/", healthRouter);

app.listen(PORT, () => {
  logger.info(`Profile service is running on port ${PORT}`);
});
