import express from "express";

const healthRouter = express.Router();

healthRouter.get("/health", (req, res) => {
  console.log("Health check endpoint called");
  res.status(200).send("OK");
});

healthRouter.get("/ready", (req, res) => {
  console.log("Ready check endpoint called");
  res.status(200).send("READY");
});

export default healthRouter;
