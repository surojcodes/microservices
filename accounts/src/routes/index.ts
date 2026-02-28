import express from "express";
import {
  createAccount,
  getAccount,
  getAccounts,
  getUserAccounts,
} from "../controllers";

const accountRouter = express.Router();

accountRouter.route("/").get(getAccounts).post(createAccount);
accountRouter.route("/:id").get(getAccount);
accountRouter.route("/user/:id").get(getUserAccounts);

export default accountRouter;
