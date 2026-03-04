import express from "express";
import {
  createAccount,
  getAccount,
  getAccounts,
  getUserAccounts,
} from "../controllers";
import { authenticateRequest } from "../middleware/auth";

const accountRouter = express.Router();
accountRouter
  .route("/")
  .get(authenticateRequest, getAccounts)
  .post(createAccount);
accountRouter.route("/:id").get(authenticateRequest, getAccount);
accountRouter.route("/user/:id").get(authenticateRequest, getUserAccounts);

export default accountRouter;
