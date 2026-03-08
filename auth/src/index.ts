import "dotenv/config";
import express from "express";
import authRouter from "./router";
import cookieParser from "cookie-parser";
import healthRouter from "./router/health";
import logger from "./logger";
import PinoHttp from "pino-http";

const app = express();
const PORT = process.env.PORT;

app.use(cookieParser());
app.use(PinoHttp({ logger }));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/", healthRouter);

app.listen(PORT, () => {
  logger.info(`Auth Service is running on ${PORT}`);
});
