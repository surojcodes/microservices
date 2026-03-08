import express from "express";
import logger from "../logger";

const healthRouter = express.Router();

healthRouter.get("/health", (req, res) => {
  logger.info("Health check endpoint called");
  res.status(200).send("OK");
});

healthRouter.get("/ready", (req, res) => {
  logger.info("Ready check endpoint called");
  res.status(200).send("READY");
});

export default healthRouter;
