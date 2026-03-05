import { log } from "node:console";
import { AccountType } from "../models";

export interface ValidationResponse {
  success: boolean;
  message?: string;
}
export const isValidAccountType = (accountType: any) => {
  return Object.values(AccountType).includes(accountType);
};

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const validateCreateAccount = (
  inputAccount: any,
  loggedUser?: { user_id: string; username: string; role: string },
): ValidationResponse => {
  if (!inputAccount.userId || typeof inputAccount.userId !== "string") {
    return {
      success: false,
      message: "Invalid userId",
    };
  }
  // Only allow admin to create account for any user, regular users can only create account for themselves
  if (
    inputAccount.userId !== loggedUser?.user_id &&
    loggedUser?.role !== UserRole.ADMIN
  ) {
    return {
      success: false,
      message: "Unauthorized to create account for other user",
    };
  }
  if (
    !inputAccount.accountType ||
    !isValidAccountType(inputAccount.accountType)
  ) {
    return {
      success: false,
      message: "Invalid accountType",
    };
  }
  if (
    inputAccount.balance !== undefined &&
    (typeof inputAccount.balance !== "number" || inputAccount.balance < 0)
  ) {
    return {
      success: false,
      message: "Invalid balance",
    };
  }
  if (
    inputAccount.accountNickname &&
    typeof inputAccount.accountNickname !== "string"
  ) {
    return {
      success: false,
      message: "Invalid accountNickname",
    };
  }
  return { success: true };
};
