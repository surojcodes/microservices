import { Request, Response } from "express";
import {
  AccountAPIRes,
  AccountEntity,
  AccountStatus,
  CreateAccountDto,
} from "../models/account-model";
import data from "../accounts.json";
import { generateAccountNumber } from "../utils/account-utils";
import { validateCreateAccount } from "../utils/validation-utils";

export const getAccounts = (req: Request, res: Response<AccountAPIRes>) => {
  const accounts = data.accounts as AccountEntity[];
  res.status(200).json({
    success: true,
    data: accounts.map((account: AccountEntity) => {
      return {
        accountNumber: account.account_number,
        userId: account.user_id,
        balance: account.balance,
        accountType: account.account_type,
        accountNickname: account.account_nickname,
        accountStatus: account.account_status,
        createdAt: account.created_at,
      };
    }),
  });
};

export const getAccount = (
  req: Request<{ id: string }>,
  res: Response<AccountAPIRes>,
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
      userId: account.user_id,
      balance: account.balance,
      accountType: account.account_type,
      accountStatus: account.account_status,
      createdAt: account.created_at,
      accountNickname: account.account_nickname,
    },
  });
};

export const getUserAccounts = (
  req: Request<{ id: string }>,
  res: Response<AccountAPIRes>,
): Response<AccountAPIRes> => {
  const { id: userId } = req.params;
  const accounts = data.accounts as AccountEntity[];
  const userAccounts = accounts.filter((account) => account.user_id === userId);
  return res.status(200).json({
    success: true,
    data: userAccounts.map((account) => {
      return {
        accountNumber: account.account_number,
        userId: account.user_id,
        balance: account.balance,
        accountType: account.account_type,
        accountStatus: account.account_status,
        createdAt: account.created_at,
        accountNickname: account.account_nickname,
      };
    }),
  });
};

export const createAccount = (
  req: Request<never, never, CreateAccountDto>,
  res: Response<AccountAPIRes>,
) => {
  const reqBody = req.body;
  const validation = validateCreateAccount(reqBody);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: validation.message || "Invalid request body",
    });
  }

  //TODO: check if the customer exists by calling customer microservice
  const accounts = data.accounts as AccountEntity[];
  const newAccount: AccountEntity = {
    user_id: reqBody.userId,
    account_type: reqBody.accountType,
    balance: reqBody.balance ?? 0,
    account_number: generateAccountNumber(reqBody.accountType, accounts),
    account_nickname: reqBody.accountNickname ?? "",
    account_status: AccountStatus.ACTIVE,
    created_at: new Date().toISOString().split("T")[0],
  };
  accounts.push(newAccount);
  res.status(201).json({
    success: true,
    data: {
      accountNumber: newAccount.account_number,
      balance: newAccount.balance,
      userId: newAccount.user_id,
      accountType: newAccount.account_type,
      accountNickname: newAccount.account_nickname,
      accountStatus: newAccount.account_status,
      createdAt: newAccount.created_at,
    },
  });
};
