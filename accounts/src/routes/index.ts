import express from "express";
import {
  createAccount,
  getAccount,
  getAccounts,
  getUserAccounts,
} from "../controllers";
import { adminOnly, authenticateRequest } from "../middleware/auth";

const accountRouter = express.Router();
accountRouter
  .route("/")
  .get(authenticateRequest, getAccounts)
  .post(authenticateRequest, createAccount);
accountRouter.route("/:id").get(authenticateRequest, getAccount);
accountRouter
  .route("/user/:id")
  .get(authenticateRequest, adminOnly, getUserAccounts);

export default accountRouter;
