import express from "express";
import {
  createAccount,
  getAccount,
  getAccounts,
  getCustomerAccounts,
} from "../controllers";

const accountRouter = express.Router();

accountRouter.route("/").get(getAccounts).post(createAccount);
accountRouter.route("/:id").get(getAccount);
accountRouter.route("/customers/:id").get(getCustomerAccounts);

export default accountRouter;
