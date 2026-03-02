import { AccountType } from "../models";

export interface ValidationResponse {
  success: boolean;
  message?: string;
}
export const isValidAccountType = (accountType: any) => {
  return Object.values(AccountType).includes(accountType);
};

export const validateCreateAccount = (
  inputAccount: any,
): ValidationResponse => {
  if (!inputAccount.userId || typeof inputAccount.userId !== "string") {
    return {
      success: false,
      message: "Invalid userId",
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
