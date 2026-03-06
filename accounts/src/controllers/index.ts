import { Request, Response } from "express";
import {
  AccountAPIRes,
  AccountStatus,
  AccountType,
  CreateAccountDto,
} from "../models";
import { UserRole, validateCreateAccount } from "../utils/validation-utils";
import { prisma, getPrismaErrorMessage } from "../utils/prisma";
import { AuthenticatedRequest } from "../middleware/auth";
import { AccountModel } from "../generated/prisma/models";
/*
 *ADMINS GET ALL ACCOUNTS
 *USER GETS HIS/HER OWN ACCOUNTS
 */
export const getAccounts = async (
  req: AuthenticatedRequest,
  res: Response<AccountAPIRes>,
) => {
  try {
    let accounts: AccountModel[] = [];
    if (req.user?.role === UserRole.ADMIN) {
      accounts = await prisma.account.findMany();
    } else {
      accounts = await prisma.account.findMany({
        where: {
          user_id: req.user?.user_id,
        },
      });
    }
    res.status(200).json({
      success: true,
      data: accounts.map((account) => {
        return {
          accountNumber: account.account_number,
          userId: account.user_id,
          balance: account.balance,
          accountType: account.account_type as AccountType,
          accountNickname: account.account_nickname || "",
          accountStatus: account.account_status as AccountStatus,
          createdAt: account.created_at,
        };
      }),
    });
  } catch (err) {
    console.error("Error fetching accounts:", err);
    const { status, message } = getPrismaErrorMessage(err);
    res.status(status).json({
      success: false,
      message,
    });
  }
};

/*
 * Takes in account number as path param, if user is admin, can access any account,
 * if user is normal user, can only access his/her own account, else return 403 forbidden
 */
export const getAccount = async (
  req: AuthenticatedRequest,
  res: Response<AccountAPIRes>,
) => {
  const accountNumber = req.params.id as string;
  if (req.user?.role !== UserRole.ADMIN) {
    const account = await prisma.account.findUnique({
      where: {
        account_number: Number(accountNumber),
      },
    });
    if (!account)
      return res.status(404).json({
        success: false,
        message: `Account with id ${accountNumber} not found`,
      });
    if (account.user_id !== req.user?.user_id) {
      return res.status(403).json({
        success: false,
        message: "Forbidden to access other user's account",
      });
    }
  }
  try {
    const accountId = Number(accountNumber);
    const account = await prisma.account.findUnique({
      where: {
        account_number: accountId,
      },
    });
    if (!account)
      return res.status(404).json({
        success: false,
        message: `Account with id ${accountNumber} not found`,
      });
    res.json({
      success: true,
      data: {
        accountNumber: account.account_number,
        userId: account.user_id,
        balance: account.balance,
        accountType: account.account_type as AccountType,
        accountStatus: account.account_status as AccountStatus,
        createdAt: account.created_at,
        accountNickname: account.account_nickname || "",
      },
    });
  } catch (err) {
    console.error(`Error fetching account with id ${accountNumber}:`, err);
    const { status, message } = getPrismaErrorMessage(err);
    res.status(status).json({
      success: false,
      message,
    });
  }
};

/*
 * ADMIN ONLY ENDPOINT TO GET ALL ACCOUNTS OF A USER, USER CAN ONLY GET HIS/HER OWN ACCOUNTS.
 */
export const getUserAccounts = async (
  req: Request<{ id: string }>,
  res: Response<AccountAPIRes>,
): Promise<Response<AccountAPIRes>> => {
  const { id: userId } = req.params;
  try {
    const userAccounts = await prisma.account.findMany({
      where: {
        user_id: userId,
      },
    });
    return res.status(200).json({
      success: true,
      data: userAccounts.map((account) => {
        return {
          accountNumber: account.account_number,
          userId: account.user_id,
          balance: account.balance,
          accountType: account.account_type as AccountType,
          accountStatus: account.account_status as AccountStatus,
          createdAt: account.created_at,
          accountNickname: account.account_nickname || "",
        };
      }),
    });
  } catch (err) {
    console.error(`Error fetching accounts for user with id ${userId}:`, err);
    const { status, message } = getPrismaErrorMessage(err);
    return res.status(status).json({
      success: false,
      message,
    });
  }
};

/*
 * ONLY ADMIN CAN CREATE ACCOUNT FOR ANY USER, USER CAN ONLY CREATE ACCOUNT FOR HIM/HERSELF. IMPLEMENT AUTHORIZATION LOGIC
 */
export const createAccount = async (
  req: Request<never, never, CreateAccountDto>,
  res: Response<AccountAPIRes>,
) => {
  const reqBody = req.body;
  const loggedUser = (req as unknown as AuthenticatedRequest).user;
  const validation = validateCreateAccount(reqBody, loggedUser);
  if (!validation.success) {
    return res.status(400).json({
      success: false,
      message: validation.message || "Invalid request body",
    });
  }
  try {
    const newAccount = await prisma.account.create({
      data: {
        user_id: reqBody.userId,
        account_type: reqBody.accountType,
        balance: reqBody.balance ?? 0,
        account_nickname: reqBody.accountNickname ?? "",
        account_status: AccountStatus.ACTIVE,
        created_at: new Date().toISOString().split("T")[0],
      },
    });
    res.status(201).json({
      success: true,
      data: {
        accountNumber: newAccount.account_number,
        balance: newAccount.balance,
        userId: newAccount.user_id,
        accountType: newAccount.account_type as AccountType,
        accountNickname: newAccount.account_nickname || "",
        accountStatus: newAccount.account_status as AccountStatus,
        createdAt: newAccount.created_at,
      },
    });
  } catch (err) {
    console.error("Error creating account:", err);
    const { status, message } = getPrismaErrorMessage(err);
    res.status(status).json({
      success: false,
      message,
    });
  }
};
