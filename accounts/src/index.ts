import express, { Request } from "express";
import data from "./accounts.json";
import { configDotenv } from "dotenv";
import { generateAccountNumber } from "./utilities/account-utils";
import {
  AccountAPIRes,
  AccountEntity,
  CreateAccountDto,
} from "./models/account-model";

configDotenv();
const PORT = process.env.PORT;
const app = express();

//GET all accounts
app.get("/accounts", (req: Request<never, AccountAPIRes>, res) => {
  const accounts = data.accounts;
  res.status(200).json({
    success: true,
    data: accounts.map((account) => {
      return {
        accountNumber: account.account_number,
        customerId: account.customer_id,
        balance: account.balance,
        type: account.type,
      };
    }),
  });
});

//GET details for an account ID
app.get(
  "/accounts/:accountId",
  (req: Request<{ accountId: String }, AccountAPIRes>, res) => {
    const { accountId } = req.params;
    const accounts = data.accounts;
    const account = accounts.find(
      (account) => account.account_number === accountId,
    );
    if (!account)
      res.status(404).json({
        success: false,
        message: `Account with id ${accountId} not found`,
      });
    else
      res.json({
        success: true,
        data: {
          accountNumber: account.account_number,
          customerId: account.customer_id,
          balance: account.balance,
          type: account.type,
        },
      });
  },
);

//GET Accounts of a customer
app.get("/accounts/customers/:customerId", (req, res) => {
  const { customerId } = req.params;
  const accounts = data.accounts;
  const customerAccounts = accounts.filter(
    (account) => account.customer_id === customerId,
  );
  res.status(200).json({
    success: true,
    data: customerAccounts.map((account) => {
      return {
        accountNumber: account.account_number,
        customerId: account.customer_id,
        balance: account.balance,
        type: account.type,
      };
    }),
  });
});

//CREATE an account for a customer
app.post(
  "/accounts",
  (req: Request<never, AccountAPIRes, CreateAccountDto>, res) => {
    const reqBody = req.body;
    if (!reqBody.type || !reqBody.customerId) {
      res.status(400).json({
        success: false,
        message: "customer id and account type are required",
      });
    }
    const accounts = data.accounts as AccountEntity[];
    const newAccount: AccountEntity = {
      customer_id: reqBody.customerId,
      type: reqBody.type,
      balance: reqBody.balance ?? 0,
      account_number: generateAccountNumber(reqBody.type, accounts),
    };
  },
);

app.listen(PORT, () => {
  console.log(`ACCOUNT_API Listening on ${PORT}`);
});
