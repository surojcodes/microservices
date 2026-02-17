import express, { Request } from "express";
import data from "./accounts.json";
import { configDotenv } from "dotenv";

configDotenv();
const PORT = process.env.PORT;
const app = express();

interface AccountDto {
  accountNumber: string;
  customerId: string;
  type: string;
  balance: number;
}

interface AccountAPIRes {
  success: boolean;
  data?: AccountDto | AccountDto[];
  message?: string;
}

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

app.listen(PORT, () => {
  console.log(`ACCOUNT_API Listening on ${PORT}`);
});
