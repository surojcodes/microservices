import { Request, Response } from "express";
import {
  AccountAPIRes,
  AccountEntity,
  CreateAccountDto,
} from "../models/account-model";
import data from "../accounts.json";
import {
  generateAccountNumber,
  isValidAccountType,
} from "../utilities/account-utils";

export const getAccounts = (
  req: Request<never, AccountAPIRes>,
  res: Response,
) => {
  const accounts = data.accounts as AccountEntity[];
  res.status(200).json({
    success: true,
    data: accounts.map((account: AccountEntity) => {
      return {
        accountNumber: account.account_number,
        customerId: account.customer_id,
        balance: account.balance,
        accountType: account.accountType,
      };
    }),
  });
};

export const getAccount = (
  req: Request<{ id: String }, AccountAPIRes>,
  res: Response,
) => {
  const { id: accountId } = req.params;
  const accounts = data.accounts as AccountEntity[];
  const account = accounts.find(
    (account) => account.account_number === accountId,
  );
  if (!account)
    return res.status(404).json({
      success: false,
      message: `Account with id ${accountId} not found`,
    });
  res.json({
    success: true,
    data: {
      accountNumber: account.account_number,
      customerId: account.customer_id,
      balance: account.balance,
      accountType: account.accountType,
    },
  });
};

export const getCustomerAccounts = (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id: customerId } = req.params;
  const accounts = data.accounts as AccountEntity[];
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
        accountType: account.accountType,
      };
    }),
  });
};

export const createAccount = (
  req: Request<never, AccountAPIRes, CreateAccountDto>,
  res: Response,
) => {
  const reqBody = req.body;
  if (!reqBody.accountType || !reqBody.customerId) {
    return res.status(400).json({
      success: false,
      message: "Customer ID and account type are required",
    });
  }
  if (!isValidAccountType(reqBody.accountType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Account type - valid values are SAVINGS AND CHECKING",
    });
  }
  //TODO: check if the customer exists by calling customer microservice
  const accounts = data.accounts as AccountEntity[];
  const newAccount: AccountEntity = {
    customer_id: reqBody.customerId,
    accountType: reqBody.accountType,
    balance: reqBody.balance ?? 0,
    account_number: generateAccountNumber(reqBody.accountType, accounts),
  };
  accounts.push(newAccount);
  res.status(201).json({
    success: true,
    data: {
      accountNumber: newAccount.account_number,
      balance: newAccount.balance,
      customerId: newAccount.customer_id,
      accountType: newAccount.accountType,
    },
  });
};
