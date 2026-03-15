import "dotenv/config";
import express from "express";
import authRouter from "./router";
import cookieParser from "cookie-parser";
import healthRouter from "./router/health";
import logger from "./logger";
import PinoHttp from "pino-http";
import { metricsMiddleware } from "./middleware/metrics";
import { register } from "./metrics";

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(PinoHttp({ logger }));
app.use(express.json());
app.use(metricsMiddleware);
app.use("/auth", authRouter);
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});
app.use("/", healthRouter);

app.listen(PORT, () => {
  logger.info(`Auth Service is running on ${PORT}`);
});
