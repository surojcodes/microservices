import express from "express";

const healthRouter = express.Router();

healthRouter.get("/health", (req, res) => {
  res.status(200).send("OK");
});

healthRouter.get("/ready", (req, res) => {
  res.status(200).send("READY");
});

export default healthRouter;
